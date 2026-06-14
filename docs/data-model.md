# PitchRotator — Data Model & Storage Spec

> What we save, where, and the privacy invariants. Backend: **Firebase /
> Firestore** (app store + the evolving voice model) + **Walrus/Seal** (durable
> encrypted artifacts) + ephemeral enclave session. Extends the types in
> `src/lib/pitchrotator-demo.ts`.

## 1. Three storage tiers

Different data lives in different places at different trust levels. Conflating
them breaks the privacy story.

| Tier | Holds | Lifetime | Raw context? |
|------|-------|----------|--------------|
| **Enclave session** (`mcp-server/`, in-memory) | working excerpts during a model call | ephemeral — discarded after session | structurally impossible |
| **Web-app store** (Firestore) | founder working data, **all speech/take data**, the evolving voice model, logs | persistent per founder | **never** — redacted/derived only |
| **Walrus** (Seal-encrypted) | durable Pitch Pack + receipt; public render + private resume/share | persistent artifact | never — always Seal-encrypted |

**Hard invariant:** raw founder context is read on the laptop, redacted there,
and **never written to Firestore or Walrus**. Both stores hold only redacted
excerpts, derived outputs, and the founder's own deliberately-recorded speech.

## 2. Firestore structure

```
founders/{founderRef}                       Founder       (durable identity)
  └─ voiceModel                             VoiceModel    (evolving — learned from ALL takes)
sessions/{sessionId}                        Session
  ├─ contextFiles/{fileId}                  ContextFile   (metadata only)
  ├─ excerpts/{excerptId}                   Excerpt       (redacted only)
  ├─ pitchVersions/{version}                PitchVersion  (versioned — re-prep appends)
  └─ takes/{takeId}                         Take          (recording + score + transcript)
voiceProfiles/{sessionId}                   FounderVoiceProfile   (session snapshot)
receipts/{sessionId}                        PrivacyReceipt
inference_events/{eventId}                  model-call log
session_events/{eventId}                    flow telemetry
```

The founder's **speech corpus** = all `takes` across their sessions, reached by a
**collection-group query** on `takes` filtered by `founderRef` — no duplication.

## 3. Core types (extend `pitchrotator-demo.ts`)

Existing types reused as-is: `ContextFile`, `Excerpt`, `FounderVoiceProfile`,
`EvidenceTrace`, `PitchRewrite`, `RehearsalScore`, `PrivacyReceipt`. New:

```ts
type Session = {
  id: string;
  founderRef: string;          // Firebase uid
  createdAt: number;
  status: "ingesting" | "prepped" | "rehearsing" | "published";
  currentPitchVersion: number;
};

type PitchVersion = {
  version: number;
  pitch: PitchRewrite;
  derivedFromTakeId?: string;  // which recording prompted this re-prep (v1 = null)
  createdAt: number;
};

// One rehearsal recording + its evaluation. The transcript is RETAINED — it is
// a permanent sample in the founder's speech corpus.
type Take = {
  id: string;
  founderRef: string;          // denormalized for the collection-group corpus query
  pitchVersion: number;
  transcript: string;
  audioSeconds: number;
  fillerCount: number;
  score: RehearsalScore;
  evidence: { axis: string; quote: string; verdict: string }[];
  junkTake: boolean;
  createdAt: number;
};

// The evolving, per-founder voice model — learned from ALL their takes across
// sessions, not just one. pitch_prep / pitch_reprep read the latest; every
// recorded take can update it.
type VoiceModel = {
  version: number;
  profile: FounderVoiceProfile;  // current best understanding of how they speak
  sampleCount: number;           // how many takes informed it
  derivedFromTakeIds: string[];  // provenance
  updatedAt: number;
};
```

## 4. Per-screen save map

| Screen | Writes | Evaluation produced |
|--------|--------|---------------------|
| 2 Context Pack | `contextFiles/*` (metadata), `excerpts/*` (redacted) | redaction stats |
| 3 Voice Profile | `voiceProfiles/{sessionId}`, `EvidenceTrace[]` | — |
| 4 Critique | critique fields on the session/pitch | — |
| 5 Rewritten Pitch | `pitchVersions/{1}` | — |
| 6 Rehearse loop | `takes/*`; **re-prep appends** `pitchVersions/{n}`; **updates** `founders/{founderRef}/voiceModel` | **`RehearsalScore` per take** |
| 7 Privacy Receipt | `receipts/{sessionId}` (+ `walrusBlobId` after publish) | the attested proof |

## 5. Voice learning loop (the compounding asset)

The founder's recorded speech is the thing that makes PitchRotator sound like
*them*, and it should get better with every practice.

1. **Every take's transcript is retained** (`Take.transcript`) — collectively the
   founder's speech corpus.
2. **After each take/session**, the accumulated speech (collection-group `takes`
   by `founderRef`) **re-derives the `voiceModel`** — extracting the natural
   phrases they actually reach for, sharpening the forbidden-style boundary,
   tracking what they keep trying to say.
3. **`pitch_prep` and `pitch_reprep` read the latest `voiceModel`**, so content
   prep is tuned to their real voice — not a one-shot guess.
4. **Cross-session compounding:** the more a founder practices and submits, the
   more accurately the voice model captures them. This is the durable, per-founder
   asset — and the reason all speech data lives in Firestore, not just the
   current session.

> The session-level `voiceProfiles/{sessionId}` is a snapshot of what we knew at
> that session; `founders/{founderRef}/voiceModel` is the living, accumulating
> model. Prep reads the living one.

## 6. Walrus integration points (bounty fit)

Walrus is **core** when we read *and* write it — and everything on it is
Seal-encrypted (blobs are public).

1. **Publish + render-back (Screen 7).** WRITE the signed, Seal-encrypted Pitch
   Pack → `walrusBlobId`; READ it back via `getFiles` to render the public
   shareable pitch page. The read-back is what makes it core, not decorative.
2. **Durable encrypted memory.** On each re-prep, WRITE the Seal-encrypted session
   artifact (voice model snapshot + pitch versions) to Walrus; READ it back to
   **resume or share a private link** (only the founder / key-holder can
   decrypt). Now Walrus is read+written across the whole loop.

Split: **Firestore** = fast, queryable working state + the voice model; **Walrus
(Seal-encrypted)** = durable artifact / shareable memory. Server route
`app/api/walrus/route.ts` (write via funded Sui signer; read via aggregator).

**Never write unencrypted private data to Walrus — always Seal first.**

## 7. Logs

```ts
type InferenceEvent = {
  founderRef: string; sessionId: string;
  provider: "anthropic" | "openrouter" | "deepgram";
  model: string;
  endpoint: "ingest" | "prep" | "evaluate" | "reprep" | "transcribe";
  inputTokens?: number; outputTokens?: number; audioSeconds?: number;
  costUsd: number;
  rawFileAccess: false;        // structurally pinned
  ts: number;
};

type SessionEvent = {
  founderRef: string; sessionId: string;
  type: "screen_enter" | "take_recorded" | "reprep" | "voicemodel_update" | "publish";
  screen?: number;
  ts: number;
};
```

## 8. Auth & scoping

- **App login: Firebase Auth.** `uid` = `founderRef`, the isolation key on every
  founder- and session-scoped doc.
- **Screen 7 signing: Dynamic** (on Sui) — signs the Privacy Receipt hash /
  published Pitch Pack. Complementary to Firebase Auth.
- **`firestore.rules`:** a founder can read/write only their own data —
  `request.auth.uid == resource.data.founderRef` (including the collection-group
  `takes` corpus and `founders/{founderRef}`).

## 9. Privacy invariants

1. **Raw context is never persisted** — not in Firestore, not in Walrus, not in
   logs. Only redacted excerpts + derived outputs + the founder's own speech.
2. **`rawFileAccess` is pinned `false`** in every inference log and receipt.
3. The **enclave session is separate** from Firestore and ephemeral.
4. **Everything on Walrus is Seal-encrypted** — public artifacts are
   render-readable; private durable memory decrypts only for the founder/key-holder.
5. **Speech transcripts are the founder's own deliberate recordings**, stored to
   improve their voice model. Apply the same auto-redaction so a third party named
   mid-pitch is masked before persistence.
6. The Privacy Receipt's `attestationQuote` is the proof that 1–5 held.

## 10. Connections & open questions

- Receipt publish + Walrus/Seal/ENS/Dynamic → `docs/sponsor-research.md`.
- MCP boundary types + the loop → `docs/mcp-spec.md`, `mcp-server/src/types.ts`.
- Screens that read/write each collection → 7-screen UX issue.
- **Open:** write `inference_events` client-side (Firebase rules) or only
  server-side from route handlers? (Lean server-side for trust.)
- **Open:** voice-model update — recompute from the full corpus each time, or
  incremental? (Full recompute is simpler for the hackathon.)
- **Open:** retention — keep sessions after publish (feeds the voice model) vs
  wipe to reinforce privacy. The voice model argues for keeping speech data.

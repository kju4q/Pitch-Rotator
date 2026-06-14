# PitchRotator — Data Model & Storage Spec

> What we save, where, and the privacy invariants. Backend: **Firebase /
> Firestore** (app store) + **Walrus** (public artifacts) + ephemeral enclave
> session. Extends the types in `src/lib/pitchrotator-demo.ts`.

## 1. Three storage tiers

Different data lives in different places at different trust levels. Conflating
them breaks the privacy story.

| Tier | Holds | Lifetime | Raw context? |
|------|-------|----------|--------------|
| **Enclave session** (`mcp-server/`, in-memory) | working excerpts during a model call | ephemeral — discarded after session | structurally impossible |
| **Web-app store** (Firestore) | founder working data + take history + logs | persistent per founder | **never** — redacted/derived only |
| **Public** (Walrus) | signed, Seal-encrypted Pitch Pack + receipt hash | published artifact | never |

**Hard invariant:** raw founder context is read on the laptop, redacted there,
and **never written to Firestore or anywhere else**. Firestore only ever holds
redacted excerpts and derived outputs.

## 2. Firestore structure

```
sessions/{sessionId}                       Session
  ├─ contextFiles/{fileId}                  ContextFile   (metadata only)
  ├─ excerpts/{excerptId}                   Excerpt       (redacted only)
  ├─ pitchVersions/{version}                PitchVersion  (versioned — re-prep appends)
  └─ takes/{takeId}                         Take          (recording + score)
voiceProfiles/{sessionId}                   FounderVoiceProfile
receipts/{sessionId}                        PrivacyReceipt
inference_events/{eventId}                  model-call log
session_events/{eventId}                    flow telemetry
```

All session-scoped docs carry `founderRef` (= Firebase Auth `uid`) for the
security rule.

## 3. Core types (extend `pitchrotator-demo.ts`)

Existing types reused as-is: `ContextFile`, `Excerpt`, `FounderVoiceProfile`,
`EvidenceTrace`, `PitchRewrite`, `RehearsalScore`, `PrivacyReceipt`. New:

```ts
type Session = {
  id: string;
  founderRef: string;          // Firebase uid
  createdAt: number;
  status: "ingesting" | "prepped" | "rehearsing" | "published";
  currentPitchVersion: number; // points at the latest PitchVersion
};

// One iteration of the pitch. Re-prep appends a new version.
type PitchVersion = {
  version: number;
  pitch: PitchRewrite;         // 30s / 60s / demo-day
  derivedFromTakeId?: string;  // which recording prompted this re-prep (v1 = null)
  createdAt: number;
};

// One rehearsal recording + its evaluation.
type Take = {
  id: string;
  pitchVersion: number;        // which pitch the founder was delivering
  transcript: string;
  audioSeconds: number;
  fillerCount: number;
  score: RehearsalScore;       // the six axes
  evidence: { axis: string; quote: string; verdict: string }[];
  junkTake: boolean;
  createdAt: number;
};
```

## 4. Per-screen save map

| Screen | Writes | Evaluation produced |
|--------|--------|---------------------|
| 2 Context Pack | `contextFiles/*` (metadata), `excerpts/*` (redacted) | redaction stats (entities masked) |
| 3 Voice Profile | `voiceProfiles/{sessionId}`, `EvidenceTrace[]` | — |
| 4 Critique | critique fields on the session/pitch | — |
| 5 Rewritten Pitch | `pitchVersions/{1}` (first prep) | — |
| 6 Rehearse loop | `takes/*`; **re-prep appends** `pitchVersions/{n}` | **`RehearsalScore` (6 axes) per take** |
| 7 Privacy Receipt | `receipts/{sessionId}` (+ `walrusBlobId` after publish) | the attested proof |

The loop on Screen 6: record → write `Take` (with `score`) → `pitch_reprep`
reads the take → write `pitchVersions/{n+1}` → bump `session.currentPitchVersion`.

## 5. Logs

Two streams, both append-only.

```ts
// Every model call, for cost + the Privacy Receipt's modelCalls ledger.
type InferenceEvent = {
  founderRef: string;
  sessionId: string;
  provider: "anthropic" | "openrouter" | "deepgram";
  model: string;
  endpoint: "ingest" | "prep" | "evaluate" | "reprep" | "transcribe";
  inputTokens?: number;
  outputTokens?: number;
  audioSeconds?: number;
  costUsd: number;
  rawFileAccess: false;        // structurally pinned
  ts: number;
};

// Flow telemetry — funnel + demo timing.
type SessionEvent = {
  founderRef: string;
  sessionId: string;
  type: "screen_enter" | "take_recorded" | "reprep" | "publish";
  screen?: number;
  ts: number;
};
```

## 6. Auth & scoping

- **App login: Firebase Auth.** `uid` = `founderRef`, the isolation key on every
  session-scoped doc.
- **Screen 7 signing: Dynamic** (on Sui) — signs the Privacy Receipt hash /
  published Pitch Pack. Complementary to Firebase Auth, not a replacement.
- **`firestore.rules`:** a founder can read/write only their own data —
  `request.auth.uid == resource.data.founderRef`. Logs are write-only from the
  client (or written server-side).

## 7. Privacy invariants

1. **Raw context is never persisted** — not in Firestore, not in logs. Only
   redacted excerpts + derived outputs.
2. **`rawFileAccess` is pinned `false`** in every inference log and receipt
   model-call record.
3. The **enclave session is separate** from Firestore and ephemeral.
4. **Walrus holds only public, signed, Seal-encrypted artifacts** — never the
   working store.
5. The Privacy Receipt's `attestationQuote` is the proof that 1–4 held.

## 8. Connections & open questions

- Receipt publish stack (Seal → Walrus → ENS, Dynamic-signed) →
  `docs/sponsor-research.md`.
- MCP boundary types → `docs/mcp-spec.md`, `mcp-server/src/types.ts`.
- Screens that read/write each collection → 7-screen UX issue.
- **Open:** do we write `inference_events` from the client (Firebase rules) or
  only server-side from the route handlers? (Lean server-side for trust.)
- **Open:** retention — are sessions kept after publish, or wiped to reinforce
  the privacy story?

# PitchRotator

**Private founder context → public pitch, without leaking your brain.**

PitchRotator is a private founder-agent. It reads your messy private context —
local notes, Claude exports, repo context, voice memos, and rough drafts —
builds a **Founder Voice Profile**, rewrites your pitch in your own words, lets
you rehearse it on video, and produces a **Privacy Receipt** proving what was
used and what never left your device.

> I gave it my messy founder brain. It gave me the pitch I was trying to say.

## Product Insight

Your best pitch is already buried in your Claude chats, notes, repo,
half-written docs, and voice memos. The problem is not generating a pitch — it
is extracting the one you already have, safely, while preserving your voice.

PitchRotator does **not** prove product-market fit, score you against thirty
simulated personas, or claim to run fully local AI. It recovers the pitch
hidden inside your own context and proves what stayed private.

## What It Is Not

- Not a PMF simulator
- Not generic AI pitch scoring
- Not thirty simulated buyer personas
- Not a judge-replacement tool
- Not "fully local AI" or a privacy guarantee we cannot keep

## Privacy Model

The privacy story is the product, so the architecture has to be precise and
honest.

**Local (in the browser):**

- file parsing and text extraction
- chunking
- sensitive entity detection
- redaction and phrase masking
- Founder Voice Profile draft
- Privacy Receipt generation

**Remote model (only after founder approval):**

- approved, redacted excerpts only
- the current pitch and target audience
- style constraints
- **never** raw files

A review gate makes this visible: the founder approves exactly which excerpts
leave the browser.

The only claims we make:

- Raw files stay local.
- Only approved, redacted excerpts are sent.
- Every generated claim is traceable.
- The founder controls what becomes public.
- The app helps recover the founder's own voice.

## The Three Agents

PitchRotator uses exactly three agents — not thirty personas — and reconciles
their answers.

1. **Self Agent** — "What is the founder really trying to say?" Produces the
   Founder Voice Profile, hidden thesis, natural phrases, and real wedge.
2. **Judge Agent** — "Would a listener understand and remember this in 60
   seconds?" Produces clarity, memorability, missing proof, and structure.
3. **Skeptic Agent** — "Why is this not just another AI pitch tool?" Produces
   the sharpest objection, differentiation gap, and what proof would change its
   mind.

The killer moment: *Your current pitch sounds like pitch feedback. Your private
context reveals the real product — a private founder-agent that recovers your
own voice from messy context.*

## The Three Visible Moats

1. **Founder Voice Profile** (emotional moat) — core belief, repeated phrases,
   emotional driver, product wedge, proof points, forbidden style. The most
   beautiful screen in the product.
2. **Evidence Trace** (trust moat) — every generated claim points back to its
   private source (e.g. *Claude export lines 42–57, voice memo 01:12–01:40*).
   Don't just generate. Trace.
3. **Privacy Receipt** (hackathon moat) — files processed locally, raw uploads,
   approved excerpts sent, entities masked, claims traced, session hash, and
   founder signature.

## MVP Scope (8 screens)

1. **Landing** — hero, subcopy, "Open PitchRotator".
2. **Private Context Pack** — upload Claude export, notes/PRD, README, rough
   pitch, voice memo transcript; show the privacy promise.
3. **Redaction Review** — detected sensitive entities, masked names/emails/
   companies, approved vs rejected excerpts, "Approve excerpts for pitch
   generation".
4. **Founder Voice Profile** — the "wow" screen.
5. **Current Pitch Critique** — what your pitch says publicly vs what your
   private context reveals; what's missing, generic, or actually you.
6. **Rewritten Pitch** — 30s / 60s / demo-day versions, each sentence carrying
   trace chips (from Claude export, README, voice memo, notes).
7. **Video Rehearsal** — record Take 1 and Take 2; score the headline metric
   "Sounds like me" alongside specificity, clarity, momentum, trust, fit.
8. **Privacy Receipt** — the trust/sponsor screen.

For the hackathon, restrict inputs to `.txt`, `.md`, `.json`, and pasted text
plus a voice-memo transcript. Do not burn hours on every file format.

## Sponsor Stack

36-hour continuity build, ≤3 sponsor SDKs, honest prior-work disclosure, prize
selection based on genuine fit — not integration farming.

Default stack: **Walrus + Dynamic + Unlink**.

- **Walrus** — publish the shareable artifacts only: encrypted Pitch Pack,
  public pitch video, privacy receipt hash, redacted evidence manifest, Founder
  Voice Profile summary, before/after transcript. Never raw context.
- **Dynamic** — founder login, wallet, and signing the Privacy Receipt and
  published Pitch Pack (and possibly agent actions / HTTP 402 agent payments).
- **Unlink** — the privacy sponsor bet ("Add Privacy to What You're Already
  Building"). Confirm at the sponsor table that the SDK fits the privacy-receipt
  / private-artifact workflow before committing.

Backup stack: **Walrus + Dynamic + ENS** — ENS (ENSIP-25) for founder-agent
identities such as `founder-agent.pitchrotator.eth` if Unlink is not a clean
fit.

## Demo Flow (≤4 minutes, no speed-up)

- 0:00–0:20 Problem — the best explanation is buried in private context
- 0:20–0:40 Product — private founder-agent → public pitch that sounds like you
- 0:40–1:15 Private Context Pack — uploads processed locally, redaction approval
- 1:15–1:50 Founder Voice Profile — beliefs, phrases, proof, forbidden style
- 1:50–2:25 Rewrite — before/after, the real wedge revealed
- 2:25–3:05 Video — Take 1 vs Take 2 improves using the founder's own language
- 3:05–3:40 Privacy Receipt — what was processed, sent, redacted, and traced
- 3:40–4:00 Sponsor proof + close — signed with Dynamic, published to Walrus

Close: *I gave it my messy founder brain. It gave me the pitch I was trying to
say.*

## Privacy Receipt Shape

```ts
type PrivacyReceipt = {
  sessionId: string;
  filesProcessedLocally: number;
  rawFilesUploaded: number;
  approvedExcerptCount: number;
  rejectedExcerptCount: number;
  sensitiveEntitiesMasked: number;
  modelCalls: { purpose: string; excerptIds: string[]; rawFileAccess: false }[];
  generatedClaims: { claim: string; sourceExcerptIds: string[] }[];
  receiptHash: string;
  founderSignature?: string;
  walrusBlobId?: string;
};
```

The demo data model for all of the above lives in `src/lib/pitchrotator-demo.ts`.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

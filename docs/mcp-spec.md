# PitchRotator — Founder-Agent MCP Spec

> The MCP that reads the founder's brain and reconstructs their pitch — then
> closes the loop: prep → record → evaluate → re-prep.
> Grounded in the `mcp-server/` scaffold (`types.ts`, `storage.ts`,
> `attestation.ts`, `.env.example`) and the web data model
> (`src/lib/pitchrotator-demo.ts`).

## 1. End goal

The founder-agent MCP reads the founder's **README + private context** — notes,
Claude exports, rough pitch, voice-memo transcript — *"gets all the brain"* — and
reconstructs the pitch they were trying to make: **what they were feeling, what
they wanted to say, and what they didn't know how to say.**

It is the **Self agent**. The founder never curates excerpts. They **read** the
prepped pitch, **record** themselves practicing it, we **evaluate** the take, and
we **re-prep** an improved pitch from that recording — and repeat. That loop is
the product.

## 2. Architecture — two components

```
[founder's laptop]                         [remote TEE enclave]            [web app]
 Local redactor MCP                         mcp-server/ (Phala TDX)         7 screens
 ─ reads README + context in place          ─ receives ONLY redacted        ─ presents
 ─ redacts entities AUTOMATICALLY   ──▶       excerpts                  ──▶   profile,
 ─ stages redacted excerpts                 ─ model calls (Opus)              pitch,
   (raw bytes never leave disk)             ─ attested Privacy Receipt        evaluation
                                                    │ TDX quote                 │
       no founder curation                          └────────── publish ────────┘
       trust = attested receipt                       Seal → Walrus → ENS (Dynamic-signed)
```

### 2.1 Local redactor MCP (founder's laptop)
- Reads README + `.txt/.md/.json` + voice transcript **in place**.
- Detects + **redacts sensitive entities automatically** (rules/regex + optional
  small local model). The founder does **not** approve or reject excerpts.
- Stages redacted excerpts for the enclave. Raw bytes never leave the disk.
- Exposes the tool surface (§4) to the founder's Claude over stdio / localhost.

### 2.2 Remote TEE enclave (`mcp-server/`)
- Receives **only** redacted excerpts — raw text is *structurally* impossible
  (`types.ts`: any excerpt missing `redactedText` is rejected).
- Model calls (OpenRouter → `claude-opus-4-8`, per `.env.example`) → Founder
  Voice Profile, rewritten pitch, take evaluation, and the re-prepped pitch.
- Emits a **hardware-attested Privacy Receipt** (Phala/dstack TDX): the receipt
  hash is bound into the TDX quote so a verifier can confirm it came from the
  published enclave image, not a "trust me" server (`attestation.ts`).
- In-enclave memory session store, `founderRef` scoping (`storage.ts`).

## 3. Privacy model — automatic redaction + attested proof

No founder-facing approval gate. The reason products usually make you approve
each item is they can't *prove* what they send — so they make you the gate.
PitchRotator's enclave produces a **hardware proof** that raw never left and only
redacted excerpts were used, so curation is unnecessary.

- **Redaction is automatic and local** — entity detection + user-tunable regex
  patterns replace matches with `[REDACTED]` before anything is staged. Bias
  toward stripping *more*.
- **Raw never leaves the laptop.**
- **Trust is the attested Privacy Receipt** — what was masked is summarized there
  at the end, with a TDX quote a verifier can check. The founder never reviews
  excerpts mid-flow.

## 4. MCP tool surface — the loop

Instructions **auto-load on connect** so the founder's Claude gets the behavior
without copy-paste.

| Tool | Where | Purpose |
|------|-------|---------|
| `pitch_ingest` | laptop | "Read my brain" — scan README + context, **auto-redact**, stage redacted excerpts |
| `pitch_prep` | enclave | Build the Founder Voice Profile + the rewritten pitch (30s / 60s / demo-day) — the pitch the founder **reads** |
| `pitch_evaluate` | enclave | Score a recorded take (the six `RehearsalScore` axes + grounded evidence) |
| `pitch_reprep` | enclave | **Redo the pitch for them** — regenerate an improved pitch from the recording transcript + evaluation |
| `pitch_receipt` | enclave | Return the attested Privacy Receipt (hash, model calls, masked-entity summary, traces, `attestationQuote`) |

**The loop:** `pitch_ingest` → `pitch_prep` → *[founder records in web]* →
`pitch_evaluate` → `pitch_reprep` → *[record again]* → … The evaluation **feeds
back** into a better pitch; that closing loop is the moat.

**Behavior model:**
- **Explicit triggers** ("read my brain", "build my pitch", "rotate my pitch") →
  immediate ingest.
- **Proactive offer** at natural moments (founder points at a README / pastes
  notes) → ask once, drop if declined.
- **PASSIVE vs ACTIVE mode** — founder can opt out of proactive prompts.
- **Personal template** — optional paste into `~/.claude/CLAUDE.md`: extra
  trigger phrases, sources to skip, voice preferences, custom redaction patterns.

## 5. Storage & scoping (`mcp-server/src/storage.ts`)

- Pluggable `SessionStore` — **in-enclave memory is the default**, deliberately
  *not* a network DB (a Postgres connection would carry founder context across
  the TEE boundary and break the privacy claim). Optional seal-to-disk uses the
  enclave-only sealing key from `attestation.ts`.
- **Per-founder `founderRef`** (derived from the session-key hash) is the
  isolation boundary.
- A session spans the whole loop (multiple takes), then is discarded.

## 6. Transport

- Enclave: MCP over **Streamable HTTP** (with SSE fallback), per-session
  transports keyed by session id + secret; HTTPS at `PUBLIC_URL`.
- Local redactor MCP: stdio or localhost HTTP for the founder's Claude.

## 7. Scaffold status (`mcp-server/`)

- **Present:** `types.ts` (boundary types, raw-text-impossible by construction —
  the `redactedText`-or-rejected rule still holds; "approved" now means "passed
  automatic redaction", not founder-approved), `storage.ts` (`SessionStore` /
  `MemorySessionStore`), `attestation.ts` (TDX quote + sealing key, explicit
  `insecure-dev` fallback), `.env.example`.
- **Missing (build target):** `src/server.ts` (MCP entry + tool handlers), the
  loop tool implementations, the **local redactor MCP**, the auto-redaction
  logic.

## 8. Honest privacy claims

- Raw files **never leave the laptop**.
- **Only redacted excerpts** cross into the enclave (type-enforced).
- The enclave is **hardware-attested**; the receipt hash is bound into a TDX
  quote a verifier checks against the published enclave measurement.
- `insecure-dev` mode is **explicit** (`ALLOW_INSECURE_NO_TEE`), never silent.
- Every model call + generated claim is **recorded and traceable** in the
  receipt; masked entities are summarized there.

## 9. Connections

- Web UX consumes the MCP output → issue (7-screen UX).
- Evaluation screen → its own issue.
- Receipt publish stack (Seal → Walrus → ENS, Dynamic-signed) →
  `docs/sponsor-research.md`.
- Data model → `src/lib/pitchrotator-demo.ts` + `mcp-server/src/types.ts`.

## 10. Open questions

1. Local redactor MCP: standalone stdio server, or bundled with the enclave
   client?
2. Auto-redaction for the hackathon: rules/regex + a small local model, or
   keep some detection browser-side?
3. Does the founder's Claude talk to the local MCP (which talks to the enclave),
   or to both directly?
4. `pitch_reprep`: how many loop iterations before the demo locks the pitch?

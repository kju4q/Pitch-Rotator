# PitchRotator — Founder-Agent MCP Spec

> The MCP that reads the founder's brain and reconstructs their pitch.
> Grounded in the `mcp-server/` scaffold (`types.ts`, `storage.ts`,
> `attestation.ts`, `.env.example`) and the web data model
> (`src/lib/pitchrotator-demo.ts`).

## 1. End goal

The founder-agent MCP reads the founder's **README + private context** — notes,
Claude exports, rough pitch, voice-memo transcript — *"gets all the brain"* — and
reconstructs the pitch they were trying to make: **what they were feeling, what
they wanted to say, and what they didn't know how to say.**

It is the **Self agent**, delivered as an MCP the founder's own Claude (Code /
Desktop / connectors) can call directly.

## 2. Architecture — two components

```
[founder's laptop]                         [remote TEE enclave]            [web app]
 Local redactor MCP                         mcp-server/ (Phala TDX)         8 screens
 ─ reads README + context in place          ─ receives ONLY redacted        ─ presents
 ─ detects + redacts entities locally  ──▶   approved excerpts          ──▶  profile,
 ─ stages approved redacted excerpts        ─ one model call (Opus)           pitch,
   (raw bytes never leave disk)             ─ attested Privacy Receipt        receipt
        ▲ approval gate                              │ TDX quote                 │
        └─ founder confirms what crosses             └────────── publish ────────┘
                                                       Seal → Walrus → ENS (Dynamic-signed)
```

### 2.1 Local redactor MCP (founder's laptop)
- Reads README + `.txt/.md/.json` + voice transcript **in place**.
- Detects + **redacts sensitive entities locally** (rules/regex + optional small
  local model). Never uploads raw bytes.
- Stages **approved redacted excerpts** behind the approval gate (§3).
- Exposes the tool surface (§4) to the founder's Claude over stdio / localhost.

### 2.2 Remote TEE enclave (`mcp-server/`)
- Receives **only** approved redacted excerpts — raw text is *structurally*
  impossible (`types.ts`: any excerpt missing `redactedText` is rejected).
- Single outbound model call (OpenRouter → `claude-opus-4-8`, per `.env.example`)
  → Founder Voice Profile, rewritten pitch, evidence traces.
- Emits a **hardware-attested Privacy Receipt** (Phala/dstack TDX): the receipt
  hash is bound into the TDX quote so a verifier can confirm it came from the
  published enclave image, not a "trust me" server (`attestation.ts`).
- In-enclave memory session store, `founderRef` scoping (`storage.ts`).

## 3. The privacy gate (staging + preview + strip)

Three primitives — each a proven pattern — enforce "raw stays local":

1. **Staging gate** — nothing crosses the laptop boundary until the founder
   approves. The approval list *is* the gate (a publish-delay store applied to
   excerpt-crossing instead of team-publishing).
2. **Preview before crossing** — before any excerpt leaves the laptop, the
   founder sees the **redacted** preview and confirms. This is the Redaction
   Review screen; confirmation is mandatory, even on an explicit "build my pitch".
3. **Privacy strip** — entity detection + user-defined regex patterns replace
   matches with `[REDACTED]` before staging. Bias toward stripping *more*.

## 4. MCP tool surface

Minimal verb set (5 tools), instructions **auto-loaded on connect** so the
founder's Claude gets the behavior without copy-paste:

| Tool | Where | Purpose |
|------|-------|---------|
| `pitch_ingest` | laptop | "Read my brain" — scan README + context, return detected sources + **candidate redacted excerpts** |
| `pitch_approve` / `pitch_reject` | laptop | The gate — founder approves/rejects each excerpt before it can cross |
| `pitch_build_profile` | enclave | Build the Founder Voice Profile from approved excerpts |
| `pitch_rewrite` | enclave | Rewrite the pitch (30s / 60s / demo-day) in the founder's voice |
| `pitch_receipt` | enclave | Return the attested Privacy Receipt (hash, model calls, traces, `attestationQuote`) |

**Behavior model:**
- **Explicit triggers** ("read my brain", "build my pitch", "rotate my pitch") →
  immediate ingest, no extra confirmation.
- **Proactive offer** at natural moments (founder points at a README / pastes
  notes) → ask once, drop if declined.
- **PASSIVE vs ACTIVE mode** — founder can opt out of proactive prompts; passive
  mode only acts on explicit requests.
- **Personal template** — optional paste into `~/.claude/CLAUDE.md`: extra
  trigger phrases, sources to skip, voice preferences, custom strip patterns.

## 5. Storage & scoping (`mcp-server/src/storage.ts`)

- Pluggable `SessionStore` — **in-enclave memory is the default**, deliberately
  *not* a network DB (a Postgres connection would carry founder context across
  the TEE boundary and break the privacy claim). Optional seal-to-disk uses the
  enclave-only sealing key from `attestation.ts`.
- **Per-founder `founderRef`** (derived from the session-key hash) is the
  isolation boundary.
- Sessions are **ephemeral** — one pitch working session.

## 6. Transport

- Enclave: MCP over **Streamable HTTP** (with SSE fallback), per-session
  transports keyed by session id + secret; HTTPS at `PUBLIC_URL`.
- Local redactor MCP: stdio or localhost HTTP for the founder's Claude.

## 7. Scaffold status (`mcp-server/`)

- **Present:** `types.ts` (boundary types, raw-text-impossible by construction),
  `storage.ts` (`SessionStore` / `MemorySessionStore`), `attestation.ts` (TDX
  quote + sealing key, explicit `insecure-dev` fallback), `.env.example`.
- **Missing (build target):** `src/server.ts` (MCP entry + tool handlers), the
  tool implementations, the **local redactor MCP**, the entity-redaction logic.

## 8. Honest privacy claims

- Raw files **never leave the laptop**.
- **Only approved redacted excerpts** cross into the enclave (type-enforced).
- The enclave is **hardware-attested**; the receipt hash is bound into a TDX
  quote a verifier checks against the published enclave measurement.
- `insecure-dev` mode is **explicit** (`ALLOW_INSECURE_NO_TEE`), never silent.
- Every model call + generated claim is **recorded and traceable** in the receipt.

## 9. Connections

- Web UX consumes the MCP output → issue (8-screen UX).
- Evaluation screen → its own issue.
- Receipt publish stack (Seal → Walrus → ENS, Dynamic-signed) →
  `docs/sponsor-research.md`.
- Data model → `src/lib/pitchrotator-demo.ts` + `mcp-server/src/types.ts`.

## 10. Open questions

1. Local redactor MCP: standalone stdio server, or bundled with the enclave
   client?
2. Entity detection for the hackathon: rules/regex + a small local model, or
   keep some detection browser-side?
3. Does the founder's Claude talk to the local MCP (which talks to the enclave),
   or to both directly?
4. Session resumption across multiple takes within one working session.

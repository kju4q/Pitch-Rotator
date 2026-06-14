# PitchRotator — Founder-Agent MCP Spec

> An MCP **server running inside a TEE** that reads the founder's brain and
> reconstructs their pitch — then closes the loop: prep → record → evaluate →
> re-prep. Built on a confidential-MCP design: **attest before send.**
> Grounded in the `mcp-server/` scaffold and `src/lib/pitchrotator-demo.ts`.

## 1. End goal

The founder-agent MCP reads the founder's **README + private context** — notes,
Claude exports, rough pitch, voice-memo transcript — *"gets all the brain"* — and
reconstructs the pitch they were trying to make: **what they were feeling, what
they wanted to say, and what they didn't know how to say.**

It is the **Self agent**. The founder never curates excerpts. They **read** the
prepped pitch, **record** themselves practicing it, we **evaluate** the take, and
we **re-prep** an improved pitch from that recording — and repeat. That loop is
the product.

## 2. Architecture — MCP server in a TEE; the founder's Claude is the client

The MCP **server runs inside a secure enclave**, and the AI client (the founder's
Claude) **remotely attests** the enclave is genuine, unmodified, published code
**before it sends anything**. That turns "trust the host" into "math the client
checks."

```
[founder's environment]                 [MCP server in TEE — Phala/dstack TDX]     [outside]
 Founder's Claude (MCP client)                                                       web app
 + auto-loaded default prompt            1. serve attestation (TDX quote)            ─ reads
   1. ATTEST the enclave  ◀───────────────  genuine + unmodified code                  redacted
   2. scrape messy env (files,                                                         ─ Voice
      repos, exports) — local access     2. receive raw — ONLY after client attests     Profile,
   3. send raw ───────────────────────▶  3. REDACT → write redacted to DB               pitch,
                                             (operator can't read raw)                   eval,
                                          4. attested Privacy Receipt (core)             re-prep
```

### 2.1 MCP client — the founder's Claude (their environment)
- The MCP installs with an **auto-loaded default prompt** (served from the MCP
  server on connect, so the founder never copies anything).
- The prompt drives the founder's Claude to **scrape/read the messy environment**
  — local files, repos, Claude exports, notes — using the founder's own local
  access (which a remote sandbox can't reach).
- **Attest before send:** Claude verifies the enclave's TDX quote (genuine,
  unmodified, published image) **before** transmitting any raw context.

### 2.2 MCP server — inside the TEE (`mcp-server/`)
- Runs in a Phala/dstack TDX enclave (`attestation.ts` produces the quote; the
  dstack deploy is the host).
- Receives raw **only after the client has attested**, then **redacts and writes
  only redacted data to the DB**. Even the operator can't read raw.
- Emits the **attested core of the Privacy Receipt** — the receipt hash bound into
  the TDX quote, proving redaction happened in the published enclave.
- In-enclave memory session store, `founderRef` scoping. The enclave does **only**
  redact + ingest + attest. Nothing else.

### 2.3 Everything else runs outside the TEE
Voice Profile, first pitch, evaluation, and the re-prep loop all consume
**redacted** data, so they run **outside** the enclave on cheap normal compute.
The enclave is a scalpel for the one moment raw exists, not a blanket.

## 3. Privacy model — attest before send

- **The client checks the math first.** The founder's Claude verifies the enclave
  is genuine + running the published code before sending raw. Privacy is not
  "trust the server" — it's "your client verified it."
- **Redaction happens inside the enclave**; only redacted data is written to the
  DB. Raw exists only transiently inside the attested enclave.
- **The redaction agent is the entire trust boundary** — so it does redact →
  re-verify before release (defense in depth) and is relentlessly tested (§7).
- **Honesty:** the enclave is claimed only when real. `insecure-dev` mode
  (`ALLOW_INSECURE_NO_TEE`) is explicit, never silent — we never tell the founder
  the enclave exists before it does.

## 4. MCP tool surface — the loop

Instructions **auto-load on connect** so the founder's Claude gets the behavior
without copy-paste.

| Tool | Where | Purpose |
|------|-------|---------|
| `pitch_ingest` | client → enclave | Scrape the messy env, **attest**, send raw to the enclave, which **redacts + ingests** |
| `pitch_prep` | outside | Build the Founder Voice Profile + rewritten pitch (the pitch the founder **reads**) |
| `pitch_evaluate` | outside | Score a recorded take (six `RehearsalScore` axes + grounded evidence) |
| `pitch_reprep` | outside | **Redo the pitch** — regenerate from the recording transcript + evaluation |
| `pitch_receipt` | enclave + outside | Assemble the Privacy Receipt: attested redaction core (enclave) + model-call ledger (outside) |

**The loop:** `pitch_ingest` (attest+redact) → `pitch_prep` → *[founder records]* →
`pitch_evaluate` → `pitch_reprep` → … The evaluation feeds back into a better pitch.

**Behavior model:** explicit triggers ("read my brain") ingest immediately;
proactive offer once at natural moments; PASSIVE/ACTIVE modes; optional
`~/.claude/CLAUDE.md` personal template (trigger phrases, sources to skip,
redaction patterns).

## 5. Storage & scoping (`mcp-server/src/storage.ts`)

- Pluggable `SessionStore` — **in-enclave memory default**, deliberately not a
  network DB (a connection would carry context across the boundary). Optional
  seal-to-disk uses the enclave-only sealing key.
- **Per-founder `founderRef`** (from the session-key hash) is the isolation
  boundary. The session spans the whole loop, then is discarded.

## 6. Transport

- MCP over **Streamable HTTP** (SSE fallback), per-session, HTTPS at `PUBLIC_URL`.
- The client attests the enclave (TDX quote check) as part of connect, before
  sending raw.

## 7. The redaction agent is the trust boundary — test it relentlessly

Privacy collapses to one component. It must have:

1. **A seeded test corpus** — every entity type (names, emails, companies,
   secrets, customer names) plus adversarial cases (split across lines, in code
   comments, foreign scripts, obfuscated).
2. **The leak invariant** — assert **zero seeded entities survive** the output. A
   single survivor fails the build.
3. **Redact → re-verify before release** — after redacting, the enclave re-scans
   its own output; nothing leaves until a clean re-scan passes.
4. **Multi-method detection** — regex + NER + an LLM pass, require *all* clear.

Compute is cheap here (no pitch generation in the enclave), so we can afford to
redact and cross-check two or three times — paranoid where it isn't safe.

## 8. Honest privacy claims

- Raw is read by the founder's Claude and sent only to an **attested** enclave.
- **Redaction happens in the enclave**; only redacted data is persisted.
- The enclave is **hardware-attested**; the receipt hash is bound into a TDX quote
  the client/verifier checks against the published measurement.
- `insecure-dev` mode is **explicit**, never silent.
- Every model call + generated claim is recorded and traceable in the receipt.

## 9. Connections

- Data tiers + Firestore + the voice-learning loop → `docs/data-model.md`.
- Receipt publish stack (Seal → Walrus → ENS, Dynamic-signed) →
  `docs/sponsor-research.md`.
- Web UX → the 7-screen UX issue. Evaluation screen → its own issue.

## 10. Open questions

1. Attestation UX: does the founder's Claude surface the attestation check, or is
   it silent until it fails?
2. Auto-redaction method mix for the hackathon (regex + small model vs LLM).
3. `pitch_reprep` iterations before the demo locks the pitch.

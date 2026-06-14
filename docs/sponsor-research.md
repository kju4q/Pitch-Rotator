# PitchRotator — Sponsor Integration Research

**Event:** ETHGlobal New York 2026 · **Question:** validate the chosen sponsor
stack and produce concrete implementation guidance.

> Method: multi-source deep research — 5 angles, 22 primary sources fetched, 101
> claims extracted, 25 adversarially verified (**24 confirmed, 1 refuted**),
> 104 agent calls. Confidence levels noted per finding.

---

## Executive summary — VERDICT

**Recommended stack: Walrus + Seal + Dynamic + ENS.** Drop Unlink.

- **Unlink is a forced fit — reject it.** Unlink is a private-**payments** tool
  (private nanopayments on Arc / Circle Gateway). PitchRotator has no payments
  flow, so the integration would be decorative. *(high confidence)*
- **ENS is the right third slot.** Store the Walrus blob id and Privacy Receipt
  hash in ENS **text records** under a founder-agent name
  (`founder-agent.pitchrotator.eth`). There is precedent (WalrENS) and it pairs
  cleanly with Walrus + Dynamic. *(high confidence)*
- **Add Seal to the Walrus flow.** Seal is **production on Sui mainnet** (the
  "Seal is beta" claim was refuted 0–3). It encrypts the Pitch Pack *before*
  Walrus upload — necessary because **Walrus blobs are public**. Strengthens both
  the Walrus prize (deeper Mysten-stack use) and the privacy story. *(high)*
- **Dynamic resolves the Sui-vs-EVM signing question.** Dynamic supports **Sui
  natively, out of the box**, so the founder signs the Privacy Receipt on the
  *same chain* the blob is stored on. No cross-chain awkwardness. *(high)*

| SDK | Role in PitchRotator | Genuine fit | Confidence |
|-----|----------------------|-------------|------------|
| **Walrus** | Primary storage for public, signed artifacts (`PrivacyReceipt.walrusBlobId`) | Core — read + write | High |
| **Seal** | Encrypt the Pitch Pack before it hits public Walrus storage | Core — privacy mechanism | High |
| **Dynamic** | Founder login + sign the Privacy Receipt / Pitch Pack on Sui | Core — trust/identity | High |
| **ENS** | Text records pointing to the Walrus blob id + receipt hash; agent name | Clean, low-effort | High |
| ~~Unlink~~ | ~~private nanopayments~~ | **Rejected — no payments flow** | High |

---

## Component findings

### Walrus — primary storage *(high confidence)*

- Decentralized blob store on Sui using erasure coding ("Red Stuff"). TS SDK is
  **`@mysten/walrus`** (`writeFiles` to write, `getFiles` to read); also a
  `walrus` CLI and an HTTP publisher + aggregator.
- **Blobs are public** and **not permanent by default** — storage is purchased
  for a duration of one or more epochs. Cost is **fixed, USD-denominated, ~$0.023
  / GB / month**.
- **Testnet is active as of June 2026.**
- **Prize:** "Best product integrating Walrus for storage." To qualify, the app
  must **actually upload data** (writing is mandatory). Reading *and* writing
  makes Walrus a core dependency rather than decorative.
- **Make it core:** publish the founder-signed **encrypted Pitch Pack** to
  Walrus, store the returned blob id in `PrivacyReceipt.walrusBlobId`, then
  **read it back** to render a public shareable pitch page.
- Sources: [Walrus SDK](https://sdk.mystenlabs.com/walrus),
  [storage costs](https://docs.wal.app/docs/system-overview/storage-costs),
  [MystenLabs/walrus](https://github.com/MystenLabs/walrus),
  [WalrENS showcase](https://ethglobal.com/showcase/walrens-yjvog).

### Seal — encryption *(high confidence)*

- **Live on Sui Mainnet (since Sept 2025)** — production, not beta *(the
  beta claim was adversarially refuted 0–3)*.
- Client-side **identity-based threshold encryption** (secret-sharing) with an
  on-chain **`seal_approve`** access policy and an **official TypeScript SDK**.
- **Encrypt before upload** since Walrus blobs are public — only the founder (or
  a key holder per the access policy) can open the Pitch Pack.
- Sources: [Seal mainnet launch](https://www.mystenlabs.com/blog/seal-mainnet-launch-privacy-access-control),
  [Seal docs](https://seal-docs.wal.app/), [Seal SDK](https://sdk.mystenlabs.com/seal).

### Dynamic — auth + signing *(high confidence)*

- **Supports Sui natively out of the box** (wallet adapter); offers MPC/TSS
  embedded wallets.
- Minimal genuine integration: **founder logs in → signs the Privacy Receipt
  hash and the published Pitch Pack on Sui**, the same chain as Walrus storage.
- Sources: [Dynamic — ETHGlobal NY 2026](https://www.dynamic.xyz/docs/overview/ethglobal-new-york-2026),
  [Dynamic adds Sui](https://www.dynamic.xyz/blog/dynamic-adds-sui-wallet-support),
  [Sui wallets](https://www.dynamic.xyz/docs/wallets/using-wallets/sui/sui-wallets).
- ⚠️ Caveat: Dynamic **arbitrary-payload signing on Sui** is strongly implied but
  not code-verified — confirm at the sponsor table.

### ENS — third slot *(high confidence)*

- "Best ENS Integration for AI Agents." Use **ENSIP-25** + **ENSIP-5 text
  records**.
- **No official ENS contenthash codec exists for Walrus** → store the
  `walrusBlobId` and `receiptHash` in **text records** under a founder-agent
  name like `founder-agent.pitchrotator.eth`.
- Precedent: **WalrENS** resolves Walrus content via ENS.
- Sources: [ENSIP-25](https://ens.domains/blog/post/ensip-25),
  [ENSIP-5 text records](https://docs.ens.domains/ens-improvement-proposals/ensip-5-text-records),
  [ENS AI agents](https://discuss.ens.domains/t/turning-ens-names-into-discoverable-ai-agents/22164),
  [ENS prize (Cannes)](https://ethglobal.com/events/cannes/prizes/ens).

### Unlink — REJECTED *(high confidence)*

- Unlink is for **private nanopayments on Arc** (Circle Gateway). PitchRotator
  has **no payments flow**, so the integration would be forced/decorative.
- Sources: [Unlink](https://www.unlink.xyz/),
  [Unlink partner integrations](https://docs.unlink.xyz/partner-integrations),
  [Circle nanopayments](https://developers.circle.com/gateway/nanopayments).

---

## Recommended artifact-publishing design (the core Walrus flow)

This is what lands on **Screen 8 (Privacy Receipt)** and satisfies "read from AND
write to Walrus as a core part of the app." *(medium confidence on exact wiring)*

1. **Assemble public artifacts** — and *only* these, never raw context: the Pitch
   Pack, public pitch video, Privacy Receipt hash, redacted evidence manifest,
   Founder Voice Profile summary, before/after transcript.
2. **Seal-encrypt** the Pitch Pack (identity-based; founder/key-holder can open).
3. **Sign** the Privacy Receipt hash with **Dynamic on Sui**.
4. **Write** the blob to **Walrus** from a server route holding a funded Sui
   signer → returns `walrusBlobId`.
5. **Point ENS at it** — write `walrusBlobId` + `receiptHash` into text records on
   the founder-agent ENS name.
6. **Read back** — the client uses `getFiles` to render a public, shareable pitch
   page. The round-trip is what makes Walrus *core*.

```
public artifacts ──Seal encrypt──▶ signed (Dynamic/Sui) ──Walrus write──▶ blobId
       └────────── ENS text records (blobId + receiptHash) ◀───────────────┘
                                   │
                       client getFiles read-back ▶ public pitch page
```

## Implementation path (Next.js + TypeScript)

- **Publish = server route** (funded Sui signer); **read = client** (`getFiles`).
- Lands on Screen 8; `walrusBlobId` flows into the existing
  `PrivacyReceipt.walrusBlobId` field.
- ⚠️ **Modified Next.js (v16):** read `node_modules/next/dist/docs` before writing
  routes — route handlers use the Web `Request`/`Response` API and async params.

## Risks & unknowns

- **Walrus NY 2026 prize amount unconfirmed.** Verified figure is **Cannes: $10k
  total** (app $4k, dev tool $6k); the NY 2026 page scrape suggested $12k. Treat
  the exact amount as unverified until confirmed at the event. *(medium)*
- **Dynamic Sui arbitrary-payload signing** — implied, not code-verified.
- **Seal `seal_approve` access policy** — not verified at the code level.
- **Walrus blobs are not permanent by default** — choose epoch duration
  deliberately so a demo artifact doesn't expire.
- **No Walrus ENS contenthash codec** — text records only.

---

## Sources

Primary unless noted. Full list with per-source claim counts:

- Walrus: [SDK](https://sdk.mystenlabs.com/walrus) · [storage costs](https://docs.wal.app/docs/system-overview/storage-costs) · [GitHub](https://github.com/MystenLabs/walrus) · [Cannes prize](https://ethglobal.com/events/cannes/prizes/walrus) · [WalrENS](https://ethglobal.com/showcase/walrens-yjvog)
- Seal: [mainnet launch](https://www.mystenlabs.com/blog/seal-mainnet-launch-privacy-access-control) · [docs](https://seal-docs.wal.app/) · [SDK](https://sdk.mystenlabs.com/seal)
- Dynamic: [NY 2026](https://www.dynamic.xyz/docs/overview/ethglobal-new-york-2026) · [Sui support](https://www.dynamic.xyz/blog/dynamic-adds-sui-wallet-support) · [embedded MPC](https://www.dynamic.xyz/docs/overview/wallets/embedded-wallets/mpc/overview) · [Sui wallets](https://www.dynamic.xyz/docs/wallets/using-wallets/sui/sui-wallets) · [EVM sign](https://docs.dynamic.xyz/wallets/using-wallets/evm/sign-a-message) · [TSS/MPC](https://www.dynamic.xyz/blog/introducing-dynamic-embedded-wallets-with-tss-mpc)
- ENS: [ENSIP-25](https://ens.domains/blog/post/ensip-25) · [ENSIP-5](https://docs.ens.domains/ens-improvement-proposals/ensip-5-text-records) · [AI agents forum](https://discuss.ens.domains/t/turning-ens-names-into-discoverable-ai-agents/22164) · [ENS prize](https://ethglobal.com/events/cannes/prizes/ens)
- Unlink: [site](https://www.unlink.xyz/) · [partner integrations](https://docs.unlink.xyz/partner-integrations) · [Circle nanopayments](https://developers.circle.com/gateway/nanopayments)

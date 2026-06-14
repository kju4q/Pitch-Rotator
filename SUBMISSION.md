# ETHGlobal Submission — PitchRotator

> Living doc. Update as we go. Drafts below; ⚠️ marks things to verify before final submit.

---

## Demonstration link

⚠️ **Need a real URL.** Pick one before submitting:
- A deployed link (e.g. Vercel: `https://pitch-rotator.vercel.app/evaluate`), or
- A demo video link (Loom / YouTube, unlisted is fine).

---

## Short description (max 100 characters, tweet-length)

> PitchRotator turns your private founder notes into a demo-day pitch that still sounds like you.

Alt (privacy front-and-center):

> Private founder context → a pitch that sounds like you. Raw files never leave your device.

---

## Description (min 280 characters)

PitchRotator is a private founder-agent for demo-day communication. Founders struggle to pitch not because the idea is weak, but because their sharpest explanation is buried in private context — Claude chats, messy notes, repo comments, voice memos, and half-written drafts. PitchRotator reads that private context locally, builds a Founder Voice Profile (your core belief, natural phrases, emotional driver, and the style to avoid), and rewrites your pitch in your own words. You then rehearse it on video, scored against six axes whose headline metric is "Sounds like me," shown as a cinematic heart-rate line where dips are where a take lost the room and peaks are where it landed. Crucially, raw files stay on your device — only founder-approved, redacted excerpts are ever sent to a model, and every generated claim is traceable to its private source, ending in a Privacy Receipt that proves what was used and what never left your browser.

---

## How it's made (min 280 characters)

The frontend is built with Next.js 16 (App Router, Turbopack) and React 19 in TypeScript, styled with Tailwind v4. The signature evaluation screen is a custom WebGL visualization built directly on Three.js: the pitch is rendered as a glowing EKG "vital signs" tube following a Catmull-Rom curve, with a fragment shader that maps the line's height to color (red = lost the room, green = landed) and a scroll-driven camera that dives into the line and pulls back to a verdict. The privacy architecture is the core design constraint: parsing, redaction, sensitive-entity masking, and Privacy Receipt generation are designed to run locally in the browser, and only founder-approved redacted excerpts are sent to the model — so we never claim "fully local AI," only the honest, defensible version. The product reasons with exactly three agents (Self, Judge, Skeptic) rather than dozens of personas.

⚠️ **Sponsor stack (onchain layer):** finish this sentence with only the SDKs actually integrated by submission — e.g. Walrus (publish shareable artifacts: Pitch Pack, video, Privacy Receipt hash — never raw context), Dynamic (founder login + signing the receipt), Unlink (privacy layer). The rules reward honest disclosure and penalize integration farming — list only what's real.

---

## Describe how AI tools were used in your project

AI is used in two ways: inside the product, and to build it.

**In the product.** PitchRotator's core is agentic. Claude models power three distinct agents that reason over the founder's approved, redacted context: a Self agent that extracts the Founder Voice Profile (core belief, natural phrases, emotional driver, forbidden style), a Judge agent that scores clarity and memorability, and a Skeptic agent that surfaces the sharpest objection. Claude also drives the pitch rewrite (30s / 60s / demo-day versions) and the six-axis rehearsal scoring whose headline metric is "Sounds like me." Critically, the model only ever receives founder-approved, redacted excerpts — never raw files — and every generated claim is traced back to its private source.

**To build it.** We used Claude Code as the primary development environment to scaffold and implement the Next.js 16 / React 19 app, the evaluation screen, the Three.js WebGL "vital signs" visualization, and the data model, and to manage the Git/PR workflow. We used Claude's design tooling (with Variant) to develop the "Vital Signs" design system — color tokens, typography, motion, and components — which we then codified into a design spec that lives in the repo.

⚠️ **Honesty check:** confirm the in-product agents are actually wired to the Claude API by submission. If still on canned demo data, change "Claude models power" → "designed to be powered by Claude."

---

## Video pitch draft (~2:45)

Beat tags: **[LIVE]** already built · **[MOCK]** Variant/design frame · **[SIMPLE]** quick to build.

**0:00–0:18 · Hook** — *[on screen: you talking, or messy notes / Claude chat scrolling]*
> "A few weeks ago I realized something annoying: my best explanation of what I'm building wasn't in my pitch deck. It was buried in my private notes, my Claude chats, a voice memo I recorded walking home. The sharp version was hiding in the mess. So instead of writing another generic pitch… I built a tool to dig it out."

**0:18–0:38 · What it is** — *[landing screen]* **[MOCK]**
> "This is PitchRotator. It's a private founder-agent. It reads your messy private context and turns it into a demo-day pitch that still sounds like you — without your raw notes ever leaving your device."

**0:38–1:00 · Input + the privacy promise** — *[Context Pack screen, dropping in files]* **[MOCK]**
> "I drop in my real stuff — notes, a Claude export, my README, a voice memo. All of it gets processed locally. Before anything is sent to a model, I see exactly what leaves my browser — and approve it."

**1:00–1:15 · Redaction review** — *[Redaction screen, masked entities]* **[MOCK]**
> "Names, emails, anything sensitive — masked. I approve the excerpts. Raw files stay with me."

**1:15–1:40 · Founder Voice Profile** — *[Voice Profile screen]* **[MOCK]**
> "Then it shows me my own voice back. My core belief. The phrases I keep reaching for — 'get people out of workflow hell.' The style to avoid. This is the part that gave me chills — it's not making the pitch better, it's making it truer."

**1:40–2:05 · The evaluation — the centerpiece** — *[/evaluate, the EKG line, scroll through]* **[LIVE]**
> "And here's where it gets real. It scores my rehearsal as a heart-rate line. Dips are where I lost the room — filler, vague claims. Peaks are where it landed. The number I actually care about? 'Sounds like me.' Take one, fifty-four. Take two… eighty-nine."

**2:05–2:25 · The honest hard part** — *[Privacy Receipt screen]* **[SIMPLE]**
> "And at the end I get a Privacy Receipt — proof of what was processed locally, what excerpts were sent, what stayed private. We don't claim 'fully local AI.' We claim the honest version: raw files stay local, only approved excerpts are sent, every claim is traceable."

**2:25–2:45 · The meta-reveal + close** — *[back to you]*
> "Here's the thing. The pitch you just watched? I didn't write it from scratch. I pulled it out of my own private notes — with PitchRotator. I gave it my messy founder brain… and it gave me the pitch I was trying to say."

---

### Video requirements (from the brief)
- 2–4 minutes (target ~2:45)
- Min 720p
- Audio with **no music**
- `.mp4` or `.mov`

# PitchRotator — Demo Spec

> Working spec for the hackathon submission demo and the evaluation screen.
> Source of truth for scenario data: `src/lib/pitchrotator-demo.ts`.
> Product framing: `README.md`.

## 1. What the demo has to prove

One sentence: **PitchRotator turns a founder's messy private context into a
demo-day pitch that still sounds like them — and proves nothing private
leaked.**

The judges need to feel three things, in this order:

1. **Wow** — "my real pitch was already buried in my own notes."
   (Founder Voice Profile screen.)
2. **Trust** — "raw files never left my laptop, and every claim is traceable."
   (Redaction Review + Privacy Receipt.)
3. **Improvement** — "Take 2 measurably sounds more like me than Take 1."
   (Evaluation screen — section 4.)

Killer line (open and close): *I gave it my messy founder brain. It gave me the
pitch I was trying to say.*

## 2. Demo scenario (data)

Use the worked example already in `src/lib/pitchrotator-demo.ts` so the demo is
deterministic and self-consistent. The founder's "before" pitch is the generic
*"AI pitch coach"* (`pitchRewrite.publicPitchSays`); the recovered "after" is
*"private founder-agent that recovers your real voice from messy context"*
(`pitchRewrite.privateContextReveals`).

Five context files (`contextFiles`): Claude export, messy notes, README, rough
pitch, voice memo. Five excerpts (`excerpts`), one deliberately **rejected**
(`ex-5`, an investor name) to show the privacy gate doing real work.

> **Recommended upgrade (flag for decision):** run the demo on the founder's
> *actual* context — the Claude Code sessions that built PitchRotator itself.
> The README's killer line is literally "I gave it my messy founder brain," and
> the most honest demo is the recursive one: the messy brain on screen is the
> real build history. Falls back cleanly to the canned scenario if we run out
> of time. **Decision needed: canned scenario vs. recursive self-demo.**

## 3. The ≤4-minute walkthrough (no speed-up)

Eight screens, timed. Each beat = what's on screen + what the narrator says.

| Time | Screen | On screen | Narration beat |
|------|--------|-----------|----------------|
| 0:00–0:20 | **1 Landing** | Hero + "Open PitchRotator" | "Your best pitch is already buried in your private context. The problem isn't generating one — it's recovering the one you already have, without leaking your brain." |
| 0:20–0:45 | **2 Private Context Pack** | 5 files load; **"read by local MCP, never uploaded"** badge; raw-bytes counter stays at 0 | "These are read by a local agent on my laptop. Raw files never leave the disk — watch the upload counter: zero." |
| 0:45–1:20 | **3 Redaction Review** | Detected entities masked; 4 excerpts approved, **1 rejected** (investor name) | "It redacts locally and asks me what's allowed to leave. I reject this one — an investor's name. Only approved, redacted excerpts go anywhere." |
| 1:20–1:55 | **4 Founder Voice Profile** | Core belief, natural phrases, emotional driver, wedge, forbidden style | "This is the wow. It found the sharp version I keep deleting: *'I'm trying to get people out of workflow hell.'* My own words, not VC slop." |
| 1:55–2:20 | **5 Current Pitch Critique** | Public-says vs private-reveals, side by side | "My public pitch said 'AI pitch coach.' My private context reveals a *private founder-agent*. The Skeptic agent flags exactly why the public version sounds like a wrapper." |
| 2:20–2:45 | **6 Rewritten Pitch** | 30s / 60s / demo-day, each sentence carrying **trace chips** | "Rewritten in my voice. Every sentence carries a chip back to its private source — Claude export lines 42–57, voice memo 01:12." |
| 2:45–3:25 | **7 Video Rehearsal → Evaluation** | Record Take 2; scorecard animates; **Take 1 vs Take 2** | "I rehearse it. Headline metric: *Sounds like me*. Take 1 was 54. After speaking it back in my own language — 89." (Section 4.) |
| 3:25–3:50 | **8 Privacy Receipt** | Files local: 5, raw uploaded: 0, masked: 14, claims traced, **signed**, Walrus blob id | "Signed with Dynamic, published to Walrus. A receipt proving what was processed, what was sent, and that every claim traces to a private source." |
| 3:50–4:00 | Close | Killer line | "I gave it my messy founder brain. It gave me the pitch I was trying to say." |

Sponsor beats land *inside* the story, not as a bolt-on: **local MCP** (privacy
mechanism), **Dynamic** (signs the receipt), **Walrus** (publishes the signed
public artifact). See `README.md` § Sponsor Stack.

## 4. Evaluation screen (deep spec)

The evaluation screen is screen **7's output** — it appears after a take is
recorded and scored. It is the proof of "improvement," and it carries the one
axis no generic pitch tool has.

### 4.1 Headline

One number, full-width: **"Sounds like me — 89"** with a Take 1 → Take 2 delta
(`+35`). This is the metric the whole product is organized around
(`RehearsalScore.soundsLikeMe`, the headline per `README.md`).

### 4.2 The six axes

From `RehearsalScore` in `pitchrotator-demo.ts`. Each axis is computed from a
named signal so the score is defensible, not vibes:

| Axis | What it means | Computed from | Source |
|------|---------------|---------------|--------|
| **soundsLikeMe** | Did you use *your own* language and avoid generic slop? | Transcript vs `FounderVoiceProfile.naturalPhrases` (hits) and `forbiddenStyle` (penalty) | **NEW** — server, the signature axis |
| **specificity** | Concrete claims vs hedge phrases | Elocute rubric `specificity` | Reuse `score-content` |
| **clarity** | Do sentences build logically; low filler | Elocute `coherence` + client-side filler density (Deepgram `filler_words=true`) | Reuse + client |
| **demoMomentum** | Pace, energy, no dead air | Client-side: words/min from transcript ÷ audio duration, pause detection | Client |
| **trust** | Are claims grounded / traceable to context | Elocute `coverage` + evidence-locking to approved excerpts | Reuse + Evidence Trace |
| **audienceFit** | Right framing for the target listener | Elocute `relevance` to demo goal / target audience (Judge agent) | Reuse `score-content` |

Demo numbers come straight from `rehearsalScores` (Take 1 → Take 2):
soundsLikeMe 54→89, specificity 48→84, clarity 61→86, demoMomentum 50→82,
trust 57→85, audienceFit 52→83.

### 4.3 Grounded evidence (no black-box scores)

Reuse Elocute's `evidence: { axis, quote, verdict }[]` pattern. Each low/high
axis shows a real quote from the transcript and a one-line verdict, e.g.:

- `soundsLikeMe` · *"trying to get people out of workflow hell"* · ✓ used your
  natural phrase
- `soundsLikeMe` · *"leveraging AI to optimize founder workflows"* · ✗ forbidden
  generic style
- `specificity` · *"reads Claude exports, notes, voice memos"* · ✓ concrete
  mechanism

### 4.4 Take 1 vs Take 2 diff

The improvement story is the demo's third act. Show both takes side by side:
six mini bars per take, the headline delta, and a one-line synthesis
("Take 2 leaned on your own phrasing and cut the hedges"). The bullshit
pre-filter from `score-content` still applies — a throwaway take scores 1 and is
labelled, which protects the metric's credibility live.

### 4.5 Wireframe

```
┌──────────────────────────────────────────────────────────┐
│  SOUNDS LIKE ME                                           │
│        89   ▲ +35 from Take 1                             │
│  ────────────────────────────────────────────────────    │
│  soundsLikeMe  ████████▉  89    specificity  ████████  84 │
│  clarity       ████████▌  86   demoMomentum  ████████  82 │
│  trust         ████████▍  85   audienceFit   ████████  83 │
│  ────────────────────────────────────────────────────    │
│  WHY                                                      │
│  ✓ soundsLikeMe  "...out of workflow hell"  your phrase   │
│  ✗ soundsLikeMe  "leveraging AI to optimize"  forbidden   │
│  ✓ specificity   "reads Claude exports, notes"  concrete  │
│  ────────────────────────────────────────────────────    │
│  TAKE 1            →            TAKE 2                     │
│  ▁▃▂▃▂▃ avg 54                ▇▇▆▇▆▇ avg 88               │
│  "leaned on your own phrasing and cut the hedges"         │
│  ────────────────────────────────────────────────────    │
│  [ Record another take ]   [ Lock pitch → Privacy Receipt ]│
└──────────────────────────────────────────────────────────┘
```

### 4.6 Data contract

Extends Elocute's `/api/score-content` (port to a Next.js v16 route handler at
`app/api/score-rehearsal/route.ts`). The "source" changes from a wiki article to
the founder's own material.

**Request** (`POST /api/score-rehearsal`):
```ts
{
  transcript: string,            // Deepgram output for the take
  audioSeconds: number,          // for demoMomentum (words/min)
  fillerCount: number,           // client-derived from Deepgram filler_words
  voiceProfile: FounderVoiceProfile,  // natural phrases + forbiddenStyle (soundsLikeMe)
  rewrittenPitch: string,        // the target the founder is delivering
  targetAudience: string,
  sessionId?: string,
}
```

**Response** (200): the six `RehearsalScore` axes + `evidence[]` + an overall,
plus the Elocute-style `bullshit` guard. Server scores soundsLikeMe / specificity
/ clarity-content / trust / audienceFit (Claude Haiku 4.5, reusing the
`score-content` call shape); client contributes demoMomentum + filler signal and
merges.

### 4.7 What's reused vs new

- **Reuse:** `score-content` call structure, system-prompt rubric, bullshit
  pre-filter, evidence rows, the weighted-score computation, Deepgram
  transcription (`filler_words=true` already on).
- **New:** the `soundsLikeMe` axis (voice-profile match), the six-axis remap,
  the Take 1↔Take 2 diff view, re-pointing "source" at the founder's pitch.

## 5. Open decisions

1. **Demo scenario** — canned (`pitchrotator-demo.ts`) vs recursive self-demo
   (§2). Recommend recursive, fall back to canned.
2. **Sponsor moment** — confirm Dynamic signs the receipt and Walrus stores the
   public artifact (pending the running research's Unlink-vs-ENS verdict).
3. **Scoring source of truth** — for the demo, do we call Claude live or play
   back `rehearsalScores`? Recommend: live for soundsLikeMe (the wow), canned
   fallback so a flaky network never breaks the 4-minute run.
```

# PitchRotator — "Vital Signs" Design System

A design system extracted from the evaluation screen (`/evaluate`). It is the
visual and motion language for PitchRotator: a private founder-agent that turns
messy private context into a pitch that still sounds like you. The aesthetic is
**clinical-meets-cinematic** — a heart-monitor for a pitch, designed by a
high-end studio. Dark, premium, data-driven, calm until it needs to glow.

Upload this whole file as design context. Every token, curve, and rule below is
load-bearing — match them exactly.

---

## 1. Design Principles

1. **The data is the hero, not the chrome.** One expressive glowing element (the
   EKG line / a score) per view. Everything else is quiet telemetry.
2. **Dark, deep, and weightless.** Near-black background with fog and depth.
   Elements float on glass, never on solid cards.
3. **Earn every color.** Color is semantic, never decorative. Red = lost the
   room. Green = landed. Cyan = neutral/monitoring. White = the founder.
4. **Motion is physics, not decoration.** Smooth lerped easing, nothing snaps.
   The camera glides; panels breathe in with scale + blur.
5. **Telemetry tone.** Monospace HUD labels, uppercase, wide-tracked, like an
   aviation or medical readout. Sentences are short and certain.
6. **Restraint is luxury.** Generous negative space. Small type. Let the void do
   the work.

---

## 2. Color Tokens

```
--bg-color     #030508   /* near-black, faint blue-cyan undertone — the void   */
--text-main    #ffffff   /* primary text, the founder, the core line           */
--text-dim     #4a5568   /* slate — labels, telemetry, inactive, Take 1        */
--accent-cyan  #00f3ff   /* neutral / monitoring / in-progress / Take 2 bar    */
--accent-red   #ff2a2a   /* lost the room — dips, filler, junk take, defensive */
--accent-green #00ff66   /* landed — peaks, "sounds like me", buy-in, success  */
```

**Semantic mapping (never break this):**

| Meaning | Color | Used for |
|---|---|---|
| The void / canvas | `#030508` | page bg, glass tint, fog |
| The founder / signal | `#ffffff` | core line, primary titles, active values |
| Quiet data | `#4a5568` | HUD labels, axis names, Take 1 baseline, hints |
| Neutral / monitoring | `#00f3ff` | status "MONITORING", mid-curve, Take 2 axis fill |
| Lost the room | `#ff2a2a` | curve dips, filler beat, junk-take state, ▼ |
| Landed | `#00ff66` | curve peaks, "Sounds like me", verdict, ▲, primary CTA |

**Glows (signature look — additive light, not flat fills):**

- Red glow: `text-shadow: 0 0 40px rgba(255,42,42,0.3)`
- Green glow: `text-shadow: 0 0 40px rgba(0,255,102,0.3)`; verdict `0 0 60px rgba(0,255,102,0.25)`
- Cyan bar bloom: `box-shadow: 0 0 12px #00f3ff`
- Green bar bloom: `box-shadow: 0 0 14px #00ff66`

**Glass surface — two exact variants (copy verbatim):**

Beat / evidence panel:
```css
background: rgba(3, 5, 8, 0.6);
backdrop-filter: blur(16px) saturate(140%);
-webkit-backdrop-filter: blur(16px) saturate(140%);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 12px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.03);
```

Wide panel (six-axis / large surfaces):
```css
background: rgba(3, 5, 8, 0.55);
backdrop-filter: blur(18px) saturate(140%);
-webkit-backdrop-filter: blur(18px) saturate(140%);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 14px;
```

**Hairlines & dividers (exact, by use):**
- Panel borders: `1px solid rgba(255, 255, 255, 0.06)`
- Pills / small labels: `1px solid rgba(255, 255, 255, 0.1)`
- Axis bar track: `rgba(255, 255, 255, 0.08)`
- Button (secondary) border: `1px solid rgba(255, 255, 255, 0.2)`
- Button (primary) border: `1px solid rgba(0, 255, 102, 0.5)`

---

## 3. Typography

**Families**

```
--font-mono: 'JetBrains Mono', monospace;   /* HUD, telemetry, labels, data, buttons */
--font-sans: 'Inter', sans-serif;            /* titles, quotes, verdict — human voice */
```

Weights loaded: JetBrains Mono 100 / 400 / 700 · Inter 300 / 600.

**The rule:** Mono = the machine talking (labels, scores, status). Inter = the
human (titles, the founder's quotes, the verdict). Never mix the roles.

**Type scale**

| Token | Font | Size | Weight | Tracking | Transform | Use |
|---|---|---|---|---|---|---|
| Verdict delta | Inter | `5rem` | 600 | `-0.04em` | — | the big `54 → 89` |
| Verdict / hero title | Inter | `4rem` | 600 | `-0.04em` | uppercase | "FUNDED"-scale statements |
| Beat title | Inter | `1.6rem` | 300 | `-0.02em` | none | "It sounded like you." |
| Beat quote | Inter | `0.8rem` | 300 *italic* | — | none | the founder's transcript line |
| Axis score (b) | Mono | `11px` | 400 | — | — | the number on a bar |
| HUD label | Mono | `10px` | 400 | `0.2em` | uppercase | telemetry, status |
| Axis name | Mono | `9px` | 400 | `0.18em` | uppercase | bar labels |
| Pill / n-axis | Mono | `10px` | 400 | `0.3em` | uppercase | "[ T+ 00:00:15 ]", "CLARITY · 61→86" |
| Verdict kicker | Mono | `10px` | 400 | `0.3em` | uppercase | "// EVALUATION COMPLETE //" |
| Micro verdict | Mono | `9px` | 400 | `0.12em` | uppercase | one-line fix under a beat |

**Tracking law:** the smaller the mono text, the wider the tracking
(`0.12em → 0.3em`). Sans titles always go *negative* (`-0.02em → -0.04em`).

---

## 4. Spacing, Layout & Shape

- **Base unit:** `0.25rem` (4px). Spacing steps used: `0.3rem · 0.5rem · 0.6rem · 0.75rem · 1rem · 1.25rem · 1.4rem · 1.5rem · 2rem`.
- **Screen padding (HUD frame):** `2.5rem` on all sides.
- **Panel padding:** beats `1.4rem`; six-axis panel `1.25rem 1.5rem`.
- **Panel max-width:** beats `320px`; six-axis panel `min(680px, 90vw)`.
- **Panel gaps:** beat inner stack `0.6rem`; axis panel grid `0.75rem 1.5rem` (row/col).
- **Radius:** beat panels `12px`; wide panels `14px`; pills `0px` (square corners); buttons `0px`.
- **Pill padding:** `0.35rem 0.8rem`.
- **HUD grid:** fixed full-viewport `grid-template-columns: 1fr 1fr; grid-template-rows: auto 1fr auto` — content pinned to the **four corners**, center left empty for the 3D stage.
- **Z-index ladder:** webgl `0` · scroll container `1` · narrative beats `5` · HUD `10` · axis panel `14` · verdict `15` · scan-line `20`.
- **Cursor:** `crosshair` everywhere (instrument feel).

---

## 5. Motion

**Master easing**

```
cubic-bezier(0.16, 1, 0.3, 1)   /* "expo-out" — the house curve, everything decelerates */
```

**Durations**

| Motion | Duration | Easing |
|---|---|---|
| Panel opacity in | `0.8s` | expo-out |
| Panel transform (slide+scale) | `1s` | expo-out |
| Axis bar fill | `1.2s` (Take 2 delayed `+0.15s`) | expo-out |
| Verdict fade | `1s` ease, `0.4s` delay | ease |
| Button sweep (`::before`) | `0.4s` | expo-out |
| Button hover (color/border) | `0.4s` | ease |
| Junk-take toggle hover | `0.3s` | ease |

**Entrance pattern (every floating element):** start `opacity:0`, offset `+30px`
and `scale(0.95)` → `active` = `opacity:1`, `translateY(0)`, `scale(1)`. After it
passes, `post` = drift the *other* way + `scale(1.05)`. Three states: `pre →
active → post`. Nothing just appears.

**Scroll model:** page is `600vh` tall; scroll progress `0→1` drives a **lerped**
camera (`lerp(current, target, 0.05)`) so input is smoothed, never 1:1. Three
acts:
- `0.0–0.1` — establish: camera flies from outside onto the line.
- `0.1–0.9` — ride: camera follows the curve with a `(-2, 3, 5)` offset, looking
  slightly ahead (`+0.05` along the curve).
- `0.9–1.0` — pull back: camera retreats to reveal the whole waveform + verdict.

**Ambient life (always on):** scan-line sweeps top→bottom every `8s`; particle
field rotates `+0.0005`/frame; scroll-hint mouse dot drops every `1.5s`.

`prefers-reduced-motion`: kill the scan-line, particle rotation, and camera lerp;
present beats and verdict as a static stacked layout.

---

## 6. The 3D Stage (EKG "Vital Signs" line)

The signature element. A glowing tube following a `CatmullRomCurve3` through a
foggy void — the pitch's conviction over time.

- **Geometry:** `TubeGeometry(curve, 300, 1.5, 16)` outer + `(curve, 300, 0.4, 8)`
  white core at `opacity 0.8`. Dual-layer = neon-sign look (bright core, colored halo).
- **Color shader:** map by world-space Y height — below 0 lerp cyan→red
  (`smoothstep 0→-35`), above 0 lerp cyan→green (`smoothstep 0→40`). **Height is
  the score:** dips literally go red, peaks literally go green.
- **Material:** `ShaderMaterial`, `AdditiveBlending`, `transparent`, `depthWrite:false`,
  fresnel edge glow (`pow(1-dot(view,normal), 2.0)`) + core brightness.
- **Atmosphere:** `FogExp2(0x030508, 0.002)`; 2000 dim `#4a5568` additive particles.
- **Camera:** `PerspectiveCamera(60°)`, `pixelRatio` capped at 2.
- **Curve shape encodes the story:** baseline → deep dip (lost room) → recovery →
  high peak (landed) → settle. Each control point = a narrative beat.

---

## 7. Components

### 7.1 HUD Telemetry (corners, `pointer-events:none`)
Mono `10px`, `0.2em`, uppercase, `#4a5568`. Structure: `LABEL: value`, value in
`#fff` or a semantic accent. Examples: `STATUS: MONITORING` (cyan),
`SIGNATURE METRIC / "SOUNDS LIKE ME"`, live `COORD_X/Y/Z`, `SIGNAL: 84`.

### 7.2 Evidence Beat (glass panel)
Stacked: **pill** (axis · `61→86`) → **delta line** (`▲/▼` + context) → **title**
(Inter, semantic-colored on dip/peak) → **quote** (italic, the founder's words) →
**verdict** (mono `9px`, the one-line fix). Anchored left/right alternately,
vertically centered. Max-width `320px`.

### 7.3 Six-Axis Panel
3-column grid of bars. Each row: name + score (right-aligned), then a `3px`
track (`rgba(255,255,255,0.08)`) with two fills — Take 1 (`#4a5568`, 0.6 opacity)
under Take 2 (cyan, or **green for the hero axis** "Sounds like me"). Bars animate
width from 0 on reveal.

### 7.4 Verdict
Centered. Kicker (mono, green) → metric label → **delta** (`54 → 89`, Inter 5rem,
Take 1 dim, arrow dim, Take 2 green gradient + glow) → **CTA row**.

### 7.5 Buttons
Exact spec:
```css
/* base */
background: transparent;
color: #ffffff;
font-family: 'JetBrains Mono', monospace;
font-size: 11px;
letter-spacing: 0.2em;
text-transform: uppercase;
padding: 1rem 2.25rem;        /* verdict CTAs; standalone hero button uses 1rem 3rem */
border: 1px solid rgba(255, 255, 255, 0.2);
transition: all 0.4s ease;
/* hover: a solid fill sweeps left→right via a ::before, text flips to #030508 */
```
- `::before` fill: full-size, starts `left: -100%`, on hover `transform: translateX(100%)`, `transition: transform 0.4s cubic-bezier(0.16,1,0.3,1)`.
- Hover text color: `#030508` (the bg). Hover border: `#ffffff`.
- **Secondary** ("Record another take"): white border `rgba(255,255,255,0.2)`, white sweep fill (`#ffffff`).
- **Primary** ("Lock pitch → Privacy Receipt"): border `rgba(0,255,102,0.5)`, sweep fill `#00ff66`, hover border `#00ff66`.

### 7.6 Pills / Labels
Mono, wide tracking, `1px` hairline border `rgba(255,255,255,0.1)`, `backdrop-filter:
blur(4px)`, square corners. The "instrument sticker."

### 7.7 Scan-line & Scroll-hint
Scan-line: full-width `2px` cyan `rgba(0,243,255,0.1)`, vertical loop. Scroll-hint:
"INITIATE SCROLL" + a `1px` gradient mouse line dropping; fades out after first scroll.

---

## 8. Voice & Copy

- **Register:** flight-recorder certainty. Short. Present tense. No hedging.
- **Mono = system speak:** uppercase, wide-tracked, terse. `MONITORING`,
  `// EVALUATION COMPLETE //`, `THROWAWAY TAKE DETECTED — SCORED 1`.
- **Inter = human truth:** lowercase-feeling, plain, a little intimate. *"It
  sounded like you."* / *"Filler broke the line."*
- **Quotes are sacred:** show the founder's actual transcript words verbatim,
  italic. Never paraphrase them in a beat.
- **Verdicts are one line, actionable:** "Cut filler words — replace each with a
  short pause." Never a paragraph.
- **The headline metric is always "Sounds like me."** Everything orbits it.
- **Never claim what isn't true:** no "fully private", no "guaranteed". Say "raw
  files stay local", "only approved excerpts sent", "every claim traceable".

---

## 9. Ready-to-Paste Prompts

**Whole-page (Variant / Claude):**
> Design an immersive, cinematic dark evaluation screen on near-black `#030508`
> with fog and depth. A single glowing heart-rate / EKG line is the hero — dips
> glow red `#ff2a2a` where a pitch lost the room, peaks glow green `#00ff66`
> where it landed, neutral cyan `#00f3ff` between. On scroll the camera dives
> into the line, rides it, then pulls back to the full waveform and a verdict
> reading "Sounds like me 54 → 89". Telemetry HUD in the four corners in
> JetBrains Mono, uppercase, `0.2em` tracking, slate `#4a5568`. Floating glass
> panels (`blur 16px`, `1px` `rgba(255,255,255,0.06)` border, `12px` radius)
> carry titles in Inter 300 and the founder's quotes in italic. All motion uses
> `cubic-bezier(0.16,1,0.3,1)`, panels breathe in with scale + blur, nothing
> snaps. Restrained, premium, lots of negative space, one glowing accent.

**Component (a card/panel):**
> A floating glass evidence card: `rgba(3,5,8,0.6)` + `backdrop-filter: blur(16px)
> saturate(140%)`, `1px solid rgba(255,255,255,0.06)`, `12px` radius, soft shadow.
> Inside, top to bottom: a mono uppercase pill (`10px`, `0.3em`), a `▲/▼` delta
> line, an Inter 1.6rem title (green if a peak, red if a dip, with a matching
> `0 0 40px` glow), an italic Inter quote, and a mono `9px` one-line verdict.

**Button:**
> Transparent mono button, `11px` uppercase `0.2em`, `1px` border. On hover an
> accent fill sweeps left→right and the text inverts to the background color.
> Primary = green `#00ff66` border + sweep; secondary = white.

---

## 10. Do / Don't

**Do** — one glowing focal point · semantic color only · glass over void · mono
labels + sans humanity · lerped motion · negative space · verbatim founder quotes.

**Don't** — solid cards · gradients-for-decoration · multiple competing accents ·
drop shadows as "depth" without glass · snappy/linear motion · paragraphs in a
verdict · privacy claims you can't keep · color that doesn't mean something.

---

## 11. Literal Reference Data (render these exactly)

**The six axes (Take 1 → Take 2), `soundsLikeMe` is the hero/green axis:**

| Axis | Label | Take 1 | Take 2 |
|---|---|---|---|
| soundsLikeMe | Sounds like me | 54 | 89 |
| specificity | Specificity | 48 | 84 |
| clarity | Clarity | 61 | 86 |
| demoMomentum | Demo momentum | 50 | 82 |
| trust | Trust | 57 | 85 |
| audienceFit | Audience fit | 52 | 83 |

**Axis bar geometry (exact):**
- Track: `height: 3px`, `background: rgba(255,255,255,0.08)`, `border-radius: 2px`, `overflow: hidden`.
- Take 1 fill: `background: #4a5568`, `opacity: 0.6`, `width: {take1}%`, `transition: width 1.2s cubic-bezier(0.16,1,0.3,1)`.
- Take 2 fill: `background: #00f3ff` (cyan) or `#00ff66` (green, hero axis only), matching `box-shadow` bloom, `width: {take2}%`, `transition: width 1.2s cubic-bezier(0.16,1,0.3,1) 0.15s`.
- Score shown = `take2 / 10` (e.g. `89 → 8.9`); junk-take = `1`.

**Verdict delta (exact):** `54` in `#4a5568` → arrow `#4a5568` (`2.5rem`) → `89` in
green gradient `linear-gradient(to bottom, #00ff66, #00b347)` clipped to text, with
`text-shadow: 0 0 60px rgba(0,255,102,0.25)`. Whole delta is Inter `5rem`, weight `600`, `letter-spacing: -0.04em`.

**Junk-take state:** body gets `.junk` → all axis Take 2 fills drop to `width: 10%`,
scores read `1`, verdict number becomes `1` in red gradient
`linear-gradient(to bottom, #ff2a2a, #b30000)`, kicker turns `#ff2a2a`, banner
"Throwaway take detected — scored 1." appears (`1px solid rgba(255,42,42,0.4)`).

**EKG curve control points (THREE.Vector3, the waveform shape):**
```
(0,   0,   0)      baseline
(0,   2,  -50)     settle
(20, -35, -120)    DIP   → clarity / filler (red)
(-10, 5,  -200)    recovery → specificity
(-30, 40, -280)    PEAK  → sounds like me (green)
(0,   10, -350)    ease down
(0,   0,  -450)    settle out
```
CatmullRom, `tension: 0.5`. Tube: `TubeGeometry(curve, 300, 1.5, 16)` halo +
`TubeGeometry(curve, 300, 0.4, 8)` white core (`#ffffff`, `opacity: 0.8`).

**Scene constants:** fog `FogExp2(0x030508, 0.002)` · camera FOV `60°` ·
`pixelRatio = min(devicePixelRatio, 2)` · 2000 particles, `#4a5568`, `size 0.5`,
`opacity 0.6`, `AdditiveBlending`, rotate `+0.0005`/frame · scan-line loop `8s`.

**Scroll container height:** `600vh`. Camera lerp factor: `0.05`. Beat reveal
windows (scroll progress): intro `0.02–0.15`, dip `0.25–0.40`, recovery
`0.50–0.65`, peak `0.75–0.88`; axis panel from `0.72`; verdict from `0.95`.

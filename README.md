# AutoPMF

AutoPMF is a CUA BuyerSim for founder narratives.

Founders often do not know whether the market rejects the product or simply
does not understand the story. AutoPMF ingests the surfaces a buyer actually
sees - website, repo, docs, demo, deck, notes, and founder pitch - then runs
simulated target buyers through them to find where conviction forms or breaks.

AutoUX tests whether users can use your product. AutoPMF tests whether buyers
can believe it.

## Product Thesis

AutoPMF helps founders find narrative-market fit before they waste months
pitching the wrong story to the wrong audience.

The product does not claim to prove product-market fit. True PMF needs real
usage, retention, revenue, and market behavior. AutoPMF focuses on the earlier
but critical question:

> Can the right market understand and believe this product?

## Core Flow

1. Founder adds product context
   - Website
   - GitHub repo
   - Docs
   - Demo transcript
   - Deck, PRD, memo, or rough notes
   - Founder voice memo
2. AutoPMF builds a Product Evidence Graph
3. CUA BuyerSim personas evaluate the real market surfaces
4. Conviction trajectories show where each buyer understood, trusted, or
   rejected the narrative
5. The Conviction Reducer clusters objections and confusion
6. The Hook Matrix tests multiple hooks across target buyer segments
7. The Narrative Graph turns the winning hook into reusable pitch slots
8. The Video Compiler renders the strongest narrative into founder-ready video
   formats
9. The EloQt practice loop scores the founder's delivery

## Architecture Vocabulary

- **Product Evidence Graph**: Claims, proof, target buyers, pain, mechanism, and
  unsupported gaps extracted from product surfaces.
- **CUA BuyerSim**: Simulated buyers that inspect the same surfaces a real buyer
  would see.
- **Conviction Trajectory**: A step-by-step trace of what a buyer saw, what they
  understood, where they hesitated, and whether they would take the next step.
- **Conviction Blockers**: The reasons buyers do not understand or believe the
  product yet.
- **Hook Matrix**: Segment-by-strategy testing, such as 5 buyer segments by 6
  hook strategies.
- **Evidence-Locked Narrative Graph**: Structured pitch slots grounded in source
  evidence: hook, problem, buyer, mechanism, proof, objection, outcome, and CTA.
- **Video Compiler**: A deterministic video spec that can later compile into
  HyperFrames compositions for 15-second, 45-second, and 90-second formats.

## MVP Scope

The first demo loop is intentionally narrow:

- Add a founder website, repo, docs, and optional pitch notes
- Simulate target buyer personas
- Score comprehension, urgency, trust, differentiation, proof, and next-step
  intent
- Generate top hooks and conviction blockers
- Produce one optimized Narrative Graph
- Show one video-ready founder narrative
- Leave founder recording and real CUA browser execution as the next build layer

## Demo Video Constraint

Submission video must not exceed 4 minutes and must not be sped up.

Suggested structure:

- 0:00-0:20 Problem: founders cannot tell if the market rejects the product or
  just does not understand it
- 0:20-0:45 Thesis: AutoPMF is a CUA BuyerSim for founder narratives
- 0:45-1:20 Input: product surfaces
- 1:20-2:00 Simulation: target buyer personas and conviction trajectories
- 2:00-2:40 Output: conviction blockers and Hook Matrix
- 2:40-3:20 Video: winning hook becomes a video-ready narrative
- 3:20-3:50 Practice: founder recording and score loop
- 3:50-4:00 Close: find the hook your market believes

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Repository Rule

This project starts from a clean scaffold and keeps its own git history inside
`/Users/0xhoti/shaperotator/autopmf`.

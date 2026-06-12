export type EvidenceSource =
  | "website"
  | "repo"
  | "docs"
  | "demo"
  | "deck"
  | "notes";

export type BuyerSegment =
  | "technical_evaluator"
  | "economic_buyer"
  | "early_adopter"
  | "investor"
  | "founder_peer";

export type HookStrategy =
  | "pain_first"
  | "outcome_first"
  | "technical_unlock"
  | "economic_roi"
  | "contrarian"
  | "founder_insight";

export type ConvictionMetric =
  | "comprehension"
  | "urgency"
  | "trust"
  | "differentiation"
  | "proof"
  | "nextStep";

export type BuyerPersona = {
  id: BuyerSegment;
  label: string;
  role: string;
  skepticism: "low" | "medium" | "high";
  currentWorkaround: string;
  proofNeeded: string[];
  objections: string[];
  languagePreference: string;
};

export type ProductEvidence = {
  id: string;
  label: string;
  source: EvidenceSource;
  claim: string;
  proof: string;
  confidence: "verified" | "partial" | "hypothesis";
};

export type ConvictionTrajectory = {
  personaId: BuyerSegment;
  hookStrategy: HookStrategy;
  score: number;
  lift: number;
  steps: string[];
  blocker: string;
  signal: string;
};

export type HookCandidate = {
  id: string;
  segment: BuyerSegment;
  strategy: HookStrategy;
  openingLine: string;
  score: number;
  proofNeeded: string;
  objectionHandled: string;
};

export type NarrativeGraph = {
  hook: string;
  problem: string;
  targetBuyer: string;
  currentWorkaround: string;
  mechanism: string;
  proof: string;
  objection: string;
  outcome: string;
  cta: string;
};

export type VideoSpec = {
  id: string;
  format: string;
  duration: string;
  slotOrder: Array<keyof NarrativeGraph>;
};

export const productEvidence: ProductEvidence[] = [
  {
    id: "surface-website",
    label: "Website",
    source: "website",
    claim: "AutoPMF evaluates the surfaces buyers actually see.",
    proof:
      "Founder inputs include website, repo, docs, demo, deck, notes, and pitch.",
    confidence: "verified",
  },
  {
    id: "surface-simulation",
    label: "BuyerSim",
    source: "notes",
    claim: "Target buyer personas evaluate comprehension, urgency, and trust.",
    proof:
      "The MVP runs buyer segments against hook strategies and produces conviction trajectories.",
    confidence: "verified",
  },
  {
    id: "surface-video",
    label: "Video compiler",
    source: "demo",
    claim: "Winning hooks can compile into programmable founder video formats.",
    proof:
      "Narrative Graph slots map into 15-second, 45-second, and 90-second video specs.",
    confidence: "partial",
  },
  {
    id: "surface-cua",
    label: "CUA execution",
    source: "repo",
    claim: "Browser agents will inspect live product surfaces like real buyers.",
    proof:
      "Current scaffold models the trajectory contract; real browser execution is a next layer.",
    confidence: "hypothesis",
  },
];

export const buyerPersonas: BuyerPersona[] = [
  {
    id: "technical_evaluator",
    label: "Technical Evaluator",
    role: "Staff engineer asked to vet adoption risk",
    skepticism: "high",
    currentWorkaround: "Manual review of docs, demo, and repo credibility",
    proofNeeded: ["architecture", "integration path", "failure modes"],
    objections: ["Is this just a wrapper?", "Can we trust the output?"],
    languagePreference: "specific, technical, no hype",
  },
  {
    id: "economic_buyer",
    label: "Economic Buyer",
    role: "Founder or operator deciding if this saves time or budget",
    skepticism: "medium",
    currentWorkaround: "Repeating pitches manually and guessing what resonates",
    proofNeeded: ["time saved", "clear ROI", "before and after narrative lift"],
    objections: ["Will this change outcomes?", "Is the setup worth it?"],
    languagePreference: "plain ROI language with visible outputs",
  },
  {
    id: "early_adopter",
    label: "Early Adopter",
    role: "Builder who feels the pain of being misunderstood",
    skepticism: "low",
    currentWorkaround: "Posting variants, asking friends, and rewriting by feel",
    proofNeeded: ["speed", "useful hooks", "shareable artifacts"],
    objections: ["Will it sound like me?", "Can I use this today?"],
    languagePreference: "direct, emotionally accurate, fast-moving",
  },
  {
    id: "investor",
    label: "Investor",
    role: "Seed investor evaluating wedge and market urgency",
    skepticism: "high",
    currentWorkaround: "Pattern matching from deck, demo, and founder clarity",
    proofNeeded: ["market wedge", "why now", "credible expansion path"],
    objections: ["Is this a feature?", "What is structurally hard to copy?"],
    languagePreference: "crisp thesis, category framing, evidence over slogans",
  },
];

export const convictionTrajectories: ConvictionTrajectory[] = [
  {
    personaId: "technical_evaluator",
    hookStrategy: "technical_unlock",
    score: 91,
    lift: 23,
    steps: [
      "Scans product surfaces for actual mechanism",
      "Finds evidence graph and trajectory contract",
      "Trust increases when unsupported claims are labeled",
      "Would inspect a live CUA replay next",
    ],
    blocker: "Needs proof that BrowserSim can evaluate real surfaces reliably.",
    signal: "Evidence lock makes the system feel auditable instead of magical.",
  },
  {
    personaId: "economic_buyer",
    hookStrategy: "economic_roi",
    score: 82,
    lift: 18,
    steps: [
      "Understands the pain of repeated founder pitch guessing",
      "Looks for saved time and reusable outputs",
      "Responds to top hook plus video-ready formats",
      "Wants a before and after conversion example",
    ],
    blocker: "ROI is believable only if the practice loop shows improvement.",
    signal: "Conviction lift is the metric that makes the value concrete.",
  },
  {
    personaId: "early_adopter",
    hookStrategy: "pain_first",
    score: 88,
    lift: 31,
    steps: [
      "Recognizes the emotional pain of being misunderstood",
      "Connects with narrative-market fit language",
      "Wants the winning hook immediately",
      "Would share the generated short-form script",
    ],
    blocker: "The product has to preserve founder voice, not flatten it.",
    signal: "The line 'find the hook your market believes' lands fastest.",
  },
  {
    personaId: "investor",
    hookStrategy: "contrarian",
    score: 76,
    lift: 12,
    steps: [
      "Understands the AutoUX-to-AutoPMF analogy",
      "Questions whether this is a durable company or a pitch feature",
      "Looks for proprietary trajectory data over time",
      "Would take a meeting if the first wedge is narrow",
    ],
    blocker: "Needs a sharper initial market than all founders.",
    signal: "CUA BuyerSim plus accumulated trajectory data suggests a moat.",
  },
];

export const hookCandidates: HookCandidate[] = [
  {
    id: "hook-technical",
    segment: "technical_evaluator",
    strategy: "technical_unlock",
    openingLine:
      "AutoUX tests whether users can use your product. AutoPMF tests whether buyers can believe it.",
    score: 94,
    proofNeeded: "Show a real trajectory from product surface to objection.",
    objectionHandled: "This is not a generic pitch generator.",
  },
  {
    id: "hook-market",
    segment: "early_adopter",
    strategy: "pain_first",
    openingLine:
      "The product did not change. The market's understanding changed.",
    score: 92,
    proofNeeded: "Show before and after hooks for the same product.",
    objectionHandled: "Better articulation can change buyer conviction.",
  },
  {
    id: "hook-roi",
    segment: "economic_buyer",
    strategy: "economic_roi",
    openingLine:
      "Stop guessing your pitch. Run 30 simulated buyers and see which hook creates conviction.",
    score: 87,
    proofNeeded: "Show the Hook Matrix and conviction lift.",
    objectionHandled: "The system returns ranked outputs, not another blank doc.",
  },
  {
    id: "hook-investor",
    segment: "investor",
    strategy: "contrarian",
    openingLine:
      "Founders spend months changing the product when the first thing broken is often the narrative.",
    score: 83,
    proofNeeded: "Show that trajectories reveal segment-specific blockers.",
    objectionHandled: "Narrative-market fit is earlier and narrower than PMF.",
  },
];

export const narrativeGraph: NarrativeGraph = {
  hook:
    "Every founder is guessing their pitch. AutoPMF runs simulated buyers through the product and finds the hook your market believes.",
  problem:
    "Founders cannot tell whether buyers reject the product or simply do not understand why it matters.",
  targetBuyer:
    "Early-stage founders with technical products, unclear positioning, and multiple possible buyer segments.",
  currentWorkaround:
    "They rewrite decks, ask friends, post random variants, and confuse feedback about the product with feedback about the story.",
  mechanism:
    "AutoPMF builds a Product Evidence Graph, runs CUA BuyerSim trajectories, clusters conviction blockers, and ranks hooks by segment.",
  proof:
    "Each optimized claim is evidence-locked to a website, repo, docs, demo, deck, or founder note.",
  objection:
    "It does not claim to prove product-market fit. It tests narrative-market fit: whether the right buyer can understand and believe the product.",
  outcome:
    "The founder gets the strongest hook, a reusable Narrative Graph, video-ready scripts, and a practice loop for delivery.",
  cta: "Simulate your market before you pitch it.",
};

export const videoSpecs: VideoSpec[] = [
  {
    id: "video-social",
    format: "15s social hook",
    duration: "0:15",
    slotOrder: ["hook", "problem", "outcome", "cta"],
  },
  {
    id: "video-founder",
    format: "45s founder intro",
    duration: "0:45",
    slotOrder: ["hook", "problem", "mechanism", "proof", "cta"],
  },
  {
    id: "video-technical",
    format: "90s technical buyer pitch",
    duration: "1:30",
    slotOrder: [
      "problem",
      "currentWorkaround",
      "mechanism",
      "proof",
      "objection",
      "cta",
    ],
  },
];

export const convictionMetrics: Record<ConvictionMetric, number> = {
  comprehension: 91,
  urgency: 84,
  trust: 86,
  differentiation: 78,
  proof: 82,
  nextStep: 88,
};

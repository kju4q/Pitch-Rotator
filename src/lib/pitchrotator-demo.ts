// PitchRotator demo data model.
//
// PitchRotator is a private founder-agent: it reads a founder's messy private
// context (notes, Claude exports, repo context, voice memos, rough drafts),
// builds a Founder Voice Profile, rewrites the pitch in the founder's own
// words, supports video rehearsal, and produces a Privacy Receipt that proves
// what was used and what never left the device.
//
// Raw files stay local. Only founder-approved, redacted excerpts are sent for
// model evaluation. Every generated claim is traceable to a private source.

export type PrivateSource =
  | "claude_export"
  | "notes"
  | "readme"
  | "rough_pitch"
  | "voice_memo";

// The three agents that reconcile the founder's private context into a public
// pitch. We deliberately use exactly three, not thirty personas.
export type AgentRole = "self" | "judge" | "skeptic";

// What gets masked locally before anything is sent to a remote model.
export type SensitiveEntity =
  | "person_name"
  | "email"
  | "company_name"
  | "secret"
  | "customer_name";

export type Agent = {
  id: AgentRole;
  label: string;
  question: string;
  inputs: string[];
  outputs: string[];
};

// A founder-context file the user drops in. Processed locally only.
export type ContextFile = {
  id: string;
  label: string;
  source: PrivateSource;
  bytes: number;
  processedLocally: true;
  rawUploaded: false;
};

// One excerpt the founder reviews before it may leave the browser. Raw text
// stays local; only the redacted form is ever eligible to be sent.
export type Excerpt = {
  id: string;
  sourceFileId: string;
  rawSpan: string; // human-readable locator, e.g. "lines 42-57"
  redactedText: string;
  maskedEntities: SensitiveEntity[];
  approved: boolean;
};

// The emotional moat. Extracted from approved excerpts.
export type FounderVoiceProfile = {
  coreBelief: string;
  naturalPhrases: string[];
  emotionalDriver: string;
  productWedge: string;
  forbiddenStyle: string;
  strongestProof: string[];
  thingsTheFounderKeepsTryingToSay: string[];
};

// The trust moat. Every generated claim points back to its private sources.
export type EvidenceTrace = {
  claim: string;
  sourceExcerptIds: string[];
};

// Before/after, the aha moment.
export type PitchRewrite = {
  publicPitchSays: string;
  privateContextReveals: string;
  thirtySecond: string;
  sixtySecond: string;
  demoDay: string;
};

// Video rehearsal scoring. "Sounds like me" is the headline metric.
export type RehearsalScore = {
  soundsLikeMe: number;
  specificity: number;
  clarity: number;
  demoMomentum: number;
  trust: number;
  audienceFit: number;
};

// The hackathon moat. Honest, buildable, demoable.
export type PrivacyReceipt = {
  sessionId: string;
  filesProcessedLocally: number;
  rawFilesUploaded: number;
  approvedExcerptCount: number;
  rejectedExcerptCount: number;
  sensitiveEntitiesMasked: number;
  modelCalls: {
    purpose: string;
    excerptIds: string[];
    rawFileAccess: false;
  }[];
  generatedClaims: EvidenceTrace[];
  receiptHash: string;
  founderSignature?: string;
  walrusBlobId?: string;
};

export const agents: Agent[] = [
  {
    id: "self",
    label: "Self Agent",
    question: "What is the founder really trying to say?",
    inputs: ["private notes", "Claude export", "voice memo", "README", "rough pitch"],
    outputs: [
      "Founder Voice Profile",
      "hidden thesis",
      "natural phrases",
      "real wedge",
      "forbidden generic style",
    ],
  },
  {
    id: "judge",
    label: "Judge Agent",
    question: "Would a listener understand and remember this in 60 seconds?",
    inputs: ["public pitch", "demo goal", "target audience"],
    outputs: [
      "clarity score",
      "memorability score",
      "missing proof",
      "confusing language",
      "suggested structure",
    ],
  },
  {
    id: "skeptic",
    label: "Skeptic Agent",
    question: "Why is this not just another AI pitch tool?",
    inputs: ["rewritten pitch", "differentiation claims"],
    outputs: [
      "sharpest objection",
      "differentiation gap",
      "trust issue",
      "privacy concern",
      "what proof would change my mind",
    ],
  },
];

export const contextFiles: ContextFile[] = [
  {
    id: "file-claude-export",
    label: "Claude chat export",
    source: "claude_export",
    bytes: 184_320,
    processedLocally: true,
    rawUploaded: false,
  },
  {
    id: "file-notes",
    label: "Messy product notes",
    source: "notes",
    bytes: 22_016,
    processedLocally: true,
    rawUploaded: false,
  },
  {
    id: "file-readme",
    label: "Product README",
    source: "readme",
    bytes: 9_412,
    processedLocally: true,
    rawUploaded: false,
  },
  {
    id: "file-rough-pitch",
    label: "Rough pitch draft",
    source: "rough_pitch",
    bytes: 3_180,
    processedLocally: true,
    rawUploaded: false,
  },
  {
    id: "file-voice-memo",
    label: "Voice memo transcript",
    source: "voice_memo",
    bytes: 6_744,
    processedLocally: true,
    rawUploaded: false,
  },
];

export const excerpts: Excerpt[] = [
  {
    id: "ex-1",
    sourceFileId: "file-claude-export",
    rawSpan: "lines 42-57",
    redactedText:
      "the real problem isn't pitch feedback, it's that my actual thinking lives in private notes and I keep flattening it into generic startup language",
    maskedEntities: ["company_name"],
    approved: true,
  },
  {
    id: "ex-2",
    sourceFileId: "file-voice-memo",
    rawSpan: "01:12-01:40",
    redactedText:
      "I'm trying to get people out of workflow hell — that's the line I keep coming back to and then deleting because it sounds too casual",
    maskedEntities: [],
    approved: true,
  },
  {
    id: "ex-3",
    sourceFileId: "file-notes",
    rawSpan: "paragraph 3",
    redactedText:
      "good products die when founders cannot explain the real insight to the right person at the right moment",
    maskedEntities: ["customer_name"],
    approved: true,
  },
  {
    id: "ex-4",
    sourceFileId: "file-rough-pitch",
    rawSpan: "opening line",
    redactedText: "we help founders improve their pitch using AI feedback",
    maskedEntities: [],
    approved: true,
  },
  {
    id: "ex-5",
    sourceFileId: "file-claude-export",
    rawSpan: "lines 88-94",
    redactedText:
      "[REDACTED: investor name] said the deck sounded like everyone else's — that stung because the private version is sharp",
    maskedEntities: ["person_name", "company_name"],
    approved: false,
  },
];

export const founderVoiceProfile: FounderVoiceProfile = {
  coreBelief:
    "Good products die when founders cannot explain the real insight.",
  naturalPhrases: [
    "I'm trying to get people out of workflow hell.",
    "the sharp version is already in my notes",
  ],
  emotionalDriver:
    "I hate when sharp private thinking becomes generic public language.",
  productWedge:
    "A private founder-agent that recovers your real voice from messy context — not generic pitch feedback.",
  forbiddenStyle: "Do not make this sound like YC/VC slop.",
  strongestProof: [
    "The founder already used this flow to improve a pitch live.",
    "The private notes contain a sharper thesis than the public deck.",
  ],
  thingsTheFounderKeepsTryingToSay: [
    "My best explanation is buried in private context.",
    "The pitch should still sound like me.",
  ],
};

export const evidenceTraces: EvidenceTrace[] = [
  {
    claim: "PitchRotator keeps raw founder context local.",
    sourceExcerptIds: ["ex-1"],
  },
  {
    claim:
      "The founder's real wedge is private context, not generic pitch feedback.",
    sourceExcerptIds: ["ex-1", "ex-2", "ex-3"],
  },
  {
    claim: "The current public pitch reads like a wrapper.",
    sourceExcerptIds: ["ex-4"],
  },
];

export const pitchRewrite: PitchRewrite = {
  publicPitchSays: "AI pitch coach.",
  privateContextReveals:
    "Private founder-agent that recovers your real voice from messy context.",
  thirtySecond:
    "Your best pitch is already buried in your private notes, chats, and voice memos. PitchRotator finds it, keeps your raw context local, and gives you a demo-day pitch that still sounds like you.",
  sixtySecond:
    "Founders don't only struggle with pitching — their best explanation is buried in private context: chats, notes, voice memos, and half-written docs. PitchRotator is a private founder-agent that reads that context locally, redacts what's sensitive, extracts your Founder Voice Profile, and rewrites your pitch in your own words. Every claim traces back to a private source, and only approved excerpts ever leave your browser.",
  demoDay:
    "PitchRotator turns your private founder chaos into a demo-day pitch that still sounds like you. Raw files stay local, approved excerpts are redacted, every claim is traceable, and the final pitch can be rehearsed on video and published with a Privacy Receipt.",
};

export const rehearsalScores: Record<"take1" | "take2", RehearsalScore> = {
  take1: {
    soundsLikeMe: 54,
    specificity: 48,
    clarity: 61,
    demoMomentum: 50,
    trust: 57,
    audienceFit: 52,
  },
  take2: {
    soundsLikeMe: 89,
    specificity: 84,
    clarity: 86,
    demoMomentum: 82,
    trust: 85,
    audienceFit: 83,
  },
};

export const privacyReceipt: PrivacyReceipt = {
  sessionId: "session-demo-001",
  filesProcessedLocally: 5,
  rawFilesUploaded: 0,
  approvedExcerptCount: 4,
  rejectedExcerptCount: 1,
  sensitiveEntitiesMasked: 14,
  modelCalls: [
    {
      purpose: "Founder Voice Profile generation",
      excerptIds: ["ex-1", "ex-2", "ex-3"],
      rawFileAccess: false,
    },
    {
      purpose: "Pitch rewrite",
      excerptIds: ["ex-1", "ex-2", "ex-3", "ex-4"],
      rawFileAccess: false,
    },
    {
      purpose: "Skeptic objection",
      excerptIds: ["ex-4"],
      rawFileAccess: false,
    },
  ],
  generatedClaims: evidenceTraces,
  receiptHash: "0xpitchrotator0000000000000000000000000000000000000000000000000000",
  founderSignature: undefined,
  walrusBlobId: undefined,
};

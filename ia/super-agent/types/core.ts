export type RiskLevel = "low" | "medium" | "high";

export type SAAction = {
  id: string;
  title: string;
  category: "CRO" | "SEO" | "ADS_READY" | "LANDING" | "TRACKING" | "COMPETITOR" | "CONTENT";
  priority: 1 | 2 | 3 | 4 | 5;
  effort: "S" | "M" | "L";
  advantage: string;
  risk: { level: RiskLevel; notes: string };
  expected: { metric: string; delta: string; timeframe: string };
  requiresApproval: boolean;
  why: string[];
  how: string[];
  rollback: string[];
};

export type CommitteeRole = "analyst" | "creator" | "optimizer" | "auditor";

export type CommitteeInput = {
  projectId: string;
  project?: { name?: string; siteUrl?: string };
  context?: any;
  scan?: any;
  constraints?: {
    country?: string;
    maxWeeklySpendUsd?: number;
    maxMonthlySpendUsd?: number;
    requireApprovalOverUsd?: number;
    cacMaxUsd?: number;
    objective?: string;
    experienceLevel?: "none" | "some" | "pro";
  };
};

export type CommitteeOpinion = {
  role: CommitteeRole;
  score: { impact: number; risk: number; confidence: number; effort: number };
  notes: string[];
  suggestedActions: SAAction[];
  redFlags: string[];
};

export type CommitteeConsensus = {
  decision: "approve" | "revise" | "block";
  topActions: SAAction[];
  rationale: string[];
  blockers: string[];
  warnings: string[];
};

export type SAPlan = {
  projectId: string;
  generatedAt: number;
  summary: {
    status: "ready" | "needs_sync" | "needs_context" | "needs_scan";
    score: number; // 0..100
    adsReadiness: "ok" | "partial" | "no";
    headline: string;
  };
  weeks: Array<{
    week: number;
    goals: string[];
    actions: SAAction[];
  }>;
  committee: {
    opinions: CommitteeOpinion[];
    consensus: CommitteeConsensus;
  };
};

export type ProposalEvent = {
  type: "proposal";
  projectId: string;
  proposalId: string;
  createdAt: number;
  source: "scan_v1" | "ads_audit" | "manual";
  recommendations: Array<{
    key: string;
    title: string;
    advantage: string;
    risk: string;
    expectedResult: string;
    priority: "P0" | "P1" | "P2";
    effort: "S" | "M" | "L";
  }>;
  confidence: number; // 0..1
};

export type DecisionEvent = {
  type: "decision";
  projectId: string;
  proposalId: string;
  decidedAt: number;
  actor: "client" | "internal";
  action: "approved" | "rejected" | "modified";
  notes?: string;
  modifications?: Array<{ key: string; change: string }>;
};

export type OutcomeEvent = {
  type: "outcome";
  projectId: string;
  proposalId: string;
  measuredAt: number;
  baseline: Record<string, number | string>;
  after: Record<string, number | string>;
  delta: Record<string, number>;
};

export type LearningLabel = {
  proposalId: string;
  projectId: string;
  labeledAt: number;
  label:
    | "correct_but_late"
    | "too_risky"
    | "too_conservative"
    | "human_improved"
    | "human_worsened"
    | "as_expected"
    | "unknown";
  summary: string;
};

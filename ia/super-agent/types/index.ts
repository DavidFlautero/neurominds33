export type RiskLevel = "low" | "medium" | "high";
export type Effort = "S" | "M" | "L";

export type Guardrails = {
  monthlyBudgetUsd: number;
  dailyBudgetUsd: number;
  maxCACUsd: number;
  requiresApprovalAboveUsd: number;
};

export type IntegrationsConfig = {
  ga4?: { propertyId: string };
  searchConsole?: { siteUrl: string };
  clarity?: { projectId: string };

  ads?: {
    google?: { customerId: string };
    meta?: { adAccountId: string };
    tiktok?: { advertiserId: string };
  };
};

export type Preferences = {
  noPopups?: boolean;
  noPricingChanges?: boolean;
  tone?: "aggressive" | "balanced" | "conservative";
};

export type ProjectConfig = {
  projectId: string;
  siteUrl: string;
  goals: { primary: string; secondary?: string[] };
  competitors: { name: string; url: string }[];
  guardrails: Guardrails;
  integrations?: IntegrationsConfig;
  preferences?: Preferences;
};

export type ScanArtifact = {
  scanId: string;
  projectId: string;
  url: string;
  createdAt: string;

  screenshots: {
    desktopFull?: string;
    mobileFull?: string;
    sections: { key: string; label: string; url: string }[];
  };

  flowRecording?: {
    url: string;
    steps: string[];
  };

  dom: {
    title?: string;
    h1?: string;
    ctas: { text: string; href?: string; selector?: string }[];
    forms: { selector?: string; fields: string[] }[];
    meta: { description?: string; canonical?: string };
  };

  heuristics: {
    mobileCtaVisible: boolean;
    hasClearPrimaryCta: boolean;
    heroHasValueProp: boolean;
    warnings: string[];
  };

  metrics?: {
    ga4?: Record<string, number | string>;
    clarity?: Record<string, number | string>;
    ads?: Record<string, number | string>;
    searchConsole?: Record<string, number | string>;
  };
};

export type RollbackPlan = {
  trigger: string;
  action: string;
  observationWindow: string;
};

export type Recommendation = {
  id: string;
  scanId: string;
  type: "CRO" | "ADS" | "SEO" | "COMPETITOR" | "TECH";
  title: string;
  description: string;

  where: { pageUrl: string; sectionKey?: string };
  evidence: { screenshotUrl?: string; notes: string[] };

  expectedImpact: { kpi: string; estimate: string };
  effort: Effort;
  risk: RiskLevel;

  requiresApproval: boolean;
  rollback: RollbackPlan;

  nextAction: "CREATE_TASK" | "ADD_TO_QUOTE" | "EXECUTE_ADS";
};

export type WeeklyPlan = {
  projectId: string;
  weekOf: string;
  topActions: Recommendation[];
  rationale: string;
};

export type TaskState =
  | "DETECTED"
  | "QUOTED"
  | "APPROVED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "VALIDATED_OK"
  | "VALIDATED_PARTIAL"
  | "VALIDATED_FAILED"
  | "CLOSED";

export type Task = {
  id: string;
  projectId: string;
  recommendationId: string;
  state: TaskState;
  createdAt: string;
  deliveredAt?: string;
  validation?: ValidationResult;
};

export type ValidationResult = {
  status: "OK" | "PARTIAL" | "FAILED";
  before: { scanId: string; screenshotUrl?: string; metrics?: Record<string, any> };
  after: { scanId: string; screenshotUrl?: string; metrics?: Record<string, any> };
  notes: string[];
  learnedPattern?: string;
};

export type Approval = {
  id: string;
  projectId: string;
  scope: "ADS" | "CRO" | "SEO" | "TECH";
  title: string;
  description: string;
  requestedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rollback: RollbackPlan;
};

export type Quote = {
  id: string;
  projectId: string;
  items: { recommendationId: string; priceUsd: number; effort: Effort }[];
  status: "DRAFT" | "SENT" | "APPROVED" | "REJECTED";
  createdAt: string;
};

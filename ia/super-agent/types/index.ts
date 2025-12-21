
export type ID = string;

export type RiskLevel = "low" | "medium" | "high";
export type Priority = 1 | 2 | 3;

export type RecommendationCategory =
  | "SEO"
  | "UX"
  | "CRO"
  | "ADS"
  | "COMPETITOR"
  | "LANDING"
  | "ANALYTICS";

export type TaskStatus =
  | "pending"
  | "quoted"
  | "approved"
  | "in_progress"
  | "delivered"
  | "validated"
  | "rejected"
  | "rolled_back";

export type ApprovalStatus = "pending" | "approved" | "rejected";

/**
 * Guardrails = límites y políticas de seguridad del agente.
 * Se alimenta desde el panel (wizard/settings).
 */
export type Guardrails = {
  currency?: "USD" | "ARS";

  maxDailySpendUSD?: number;
  maxMonthlySpendUSD?: number;

  /** "Si el gasto supera X, pedir aprobación" */
  requireApprovalAboveUSD?: number;

  /** límites de CPA/CAC */
  maxCPAUsd?: number;
  maxCACUsd?: number;

  /** Flags de automatización */
  allowAutoApplySiteChanges?: boolean;
  allowAutoApplyAdsChanges?: boolean;

  /** Allow extensions */
  [key: string]: any;
};

/**
 * ProjectConfig is the canonical input for the agent.
 * It's the configuration that comes from your "panel".
 */
export interface ProjectConfig {
  projectId: ID;
  siteUrl: string;

  /** Optional: label shown in UI */
  name?: string;

  guardrails?: Guardrails;

  competitors?: { name: string; url: string }[];

  /**
   * Integrations (shape is stable; actual credentials are stored in DB/panel).
   * Keep "any" OUT. Define keys explicitly to avoid type drift.
   */
  integrations?: {
    ga4?: {
      enabled?: boolean;
      propertyId?: string;
      credentialsJson?: string;
    };
    searchConsole?: {
      enabled?: boolean;
      site?: string;
      credentialsJson?: string;
    };
    clarity?: {
      enabled?: boolean;
      projectId?: string;
      apiKey?: string;
    };
    ads?: {
      google?: {
        enabled?: boolean;
        customerId?: string;
      };
      meta?: {
        enabled?: boolean;
        adAccountId?: string;
      };
      tiktok?: {
        enabled?: boolean;
        adAccountId?: string;
      };
    };
  };

  /**
   * Business context (from wizard)
   * Closed-options only.
   */
  context?: {
    businessStage?: "new" | "growing" | "established";
    goal?: "sales" | "leads" | "traffic" | "awareness";
    experienceLevel?: "none" | "basic" | "advanced";
    budget?: {
      currency?: "USD" | "ARS";
      daily?: number;
      weekly?: number;
      monthly?: number;
      maxCpc?: number;
    };
    region?: {
      country?: string;
      city?: string;
      timezone?: string;
      language?: string;
    };
  };

  /** allow extensions, without breaking older code paths */
  [key: string]: any;
}

/**
 * ScanArtifact = resultado del Scan real (HTML/SEO/UX/Ads readiness).
 * IMPORTANT: fetchedAt must be epoch ms (number).
 */
export interface ScanArtifact {
  scanId: ID;

  projectId: ID;
  url: string;

  /** epoch ms */
  fetchedAt: number;

  /** Alias legacy: some code uses createdAt */
  createdAt?: number;

  // lightweight extracted signals (v1)
  title?: string | null;
  h1?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  robots?: string | null;

  htmlBytes?: number;

  // Scoring v1 (0..100)
  seoScore?: number;
  uxScore?: number;

  // Ads readiness v1
  adsReady?: boolean;
  adsReadyReasons?: string[];

  // Optional raw payload for debugging (never show to public users)
  raw?: Record<string, unknown>;

  // Optional: visuals for UI (if you later store screenshots)
  screenshots?: {
    desktop?: string;
    mobile?: string;
  };

  // Optional: flow recording artifact (Playwright later)
  flowRecording?: {
    kind?: "critical_flow";
    url?: string;
    steps?: Array<{ t: string; data?: any }>;
  };
}

export interface Recommendation {
  id: ID;
  projectId: ID;
  scanId?: ID;

  category: RecommendationCategory;
  title: string;
  detail: string;

  advantage: string;
  risk: string;
  expected: string;

  priority: Priority;

  /** actionable what to change */
  action: string;

  impact?: {
    cvr?: string;
    aov?: string;
    roas?: string;
    cpa?: string;
    revenue?: string;
  };

  createdAt: number; // epoch ms
}

export interface Quote {
  id: ID;
  projectId: ID;
  recommendationId?: ID;

  title: string;
  description: string;

  currency: "USD" | "ARS";
  price: number;

  includes: string[];
  timeline: string;

  risks: string[];
  expected: string[];

  status: "draft" | "sent" | "accepted" | "rejected" | "expired";

  createdAt: number; // epoch ms
}

export interface Approval {
  id: ID;
  projectId: ID;
  scope: "ads" | "site" | "seo" | "tracking" | "general";

  status: ApprovalStatus;

  rationale: string;

  limits?: {
    maxDailySpendUSD?: number;
    maxMonthlySpendUSD?: number;
    requireApprovalAboveUSD?: number;
  };

  createdAt: number; // epoch ms
  decidedAt?: number; // epoch ms
}

export interface Task {
  id: ID;
  projectId: ID;
  quoteId?: ID;
  recommendationId?: ID;

  title: string;
  description?: string;

  status: TaskStatus;

  createdAt: number; // epoch ms
  updatedAt?: number; // epoch ms

  /** For validation */
  before?: Record<string, any>;
  after?: Record<string, any>;
}

/**
 * Weekly plan types.
 * Keep minimal, UI-friendly.
 */
export type PlanAction = {
  id: ID;
  title: string;
  rationale?: string;

  category?: RecommendationCategory;
  priority?: Priority;

  advantage?: string;
  risk?: string;
  expected?: string;

  /** what to do, step-by-step */
  steps?: string[];

  /** requires explicit approval? */
  needsApproval?: boolean;

  /** suggested owner */
  owner?: "client" | "agency" | "agent";

  /** optional KPI target */
  kpi?: { name: string; target?: string };
};

export type WeeklyPlan = {
  // owning project
  projectId?: ID;

  weekOf: number; // epoch ms
  headline: string;
  actions: PlanAction[];
  notes?: Record<string, string>;
};

/**
 * Human-in-the-loop memory: preferences learned over time.
 */
export type Preferences = {
  riskTolerance?: "low" | "medium" | "high";
  budgetSensitivity?: "tight" | "normal" | "aggressive";
  autonomyLevel?: "manual" | "assisted" | "auto";
  channelsAllowed?: Array<"google_ads" | "meta_ads" | "tiktok_ads" | "seo">;
  notes?: string;
};
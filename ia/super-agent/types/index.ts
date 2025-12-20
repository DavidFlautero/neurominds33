/**
 * Shared types for Super Agent (UI + API + internal engine).
 * Keep these stable to avoid build breaks.
 */

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
 * ProjectConfig is the canonical input for the agent.
 * It's the configuration that comes from your "panel".
 */
export interface ProjectConfig {
  projectId: ID;
  siteUrl: string;

  // Optional: project name / label shown in UI
  name?: string;

  // Guardrails
  guardrails?: Guardrails;

  // Competitors
  competitors?: { name: string; url: string }[];

  // Integrations (placeholders for now)
  integrations?: any;
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

  // Business context (from wizard)
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
}

export interface ScanArtifact {
  projectId: ID;
  url: string;
  fetchedAt: number; // epoch ms

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

  // what to change (actionable)
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
  status: TaskStatus;

  owner?: string; // "agent" | "human" | name
  notes?: string;

  before?: Record<string, unknown>;
  after?: Record<string, unknown>;

  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

export interface WeeklyPlan {
  projectId: ID;
  weekStart: string; // ISO date "YYYY-MM-DD"
  summary: string;

  // top actions for the week
  actions: Array<{
    title: string;
    why: string;
    risk: RiskLevel;
    expected: string;
    requiresApproval: boolean;
    category: RecommendationCategory;
  }>;

  // Optional raw committee notes
  committeeNotes?: {
    analyst?: string;
    creator?: string;
    optimizer?: string;
    auditor?: string;
  };
}

/**
 * Budget / safety constraints for automatic execution.
 * Keep backwards-compatible keys while the system evolves.
 */
export type Guardrails = {
  /** Current API keys */
  monthlyBudgetUsd?: number;
  dailyBudgetUsd?: number;
  maxCACUsd?: number;
  requiresApprovalAboveUsd?: number;

  /** Legacy keys */
  maxDailySpendUSD?: number;
  maxMonthlySpendUSD?: number;
  requireApprovalAboveUSD?: number;
  allowAutoApplySiteChanges?: boolean;
  allowAutoApplyAdsChanges?: boolean;

  /** Allow extensions */
  [key: string]: any;
};

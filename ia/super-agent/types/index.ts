/**
 * Shared types for Super Agent (UI + API + internal engine).
 * Keep these minimal and stable to avoid build breaks.
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

export interface ScanArtifact {
  projectId: ID;
  url: string;
  fetchedAt: number; // epoch ms
  htmlBytes?: number;

  // Lightweight extracted signals (v1)
  title?: string | null;
  h1?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  robots?: string | null;

  // Scoring v1
  seoScore?: number; // 0..100
  uxScore?: number;  // 0..100
  adsReady?: boolean;

  // Optional raw payload for debugging
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

  // Actionable change request (what to do)
  action: string;

  // Optional impact model (strings to keep flexible for now)
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
  timeline: string; // e.g. "24-48h", "3-5 días"

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

  // Human-readable explanation presented to client/user
  rationale: string;

  // Guardrails / limits
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

  // execution details
  owner?: string; // "agent" | "human" | name
  notes?: string;

  // before/after references
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;

  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

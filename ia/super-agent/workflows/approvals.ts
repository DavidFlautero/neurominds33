import type { Approval, ProjectConfig, Recommendation, RiskLevel } from "../types";

/**
 * Approvals workflow (MVP)
 * - Creates approval requests for risky actions (ads/site/seo/tracking)
 * - Keeps Approval type clean: no extra fields like rollback inside Approval
 */

function now() {
  return Date.now();
}

function scopeFromCategory(cat?: string): Approval["scope"] {
  const c = (cat || "").toUpperCase();
  if (c.includes("ADS")) return "ads";
  if (c.includes("SEO")) return "seo";
  if (c.includes("TRACK")) return "tracking";
  if (c.includes("UX") || c.includes("CRO") || c.includes("LANDING")) return "site";
  return "general";
}

function riskFromRecommendation(r: Recommendation): RiskLevel {
  // If your Recommendation already has risk as string, normalize it.
  const txt = (r.risk || "").toLowerCase();
  if (txt.includes("alto") || txt.includes("high") || txt.includes("riesgo alto")) return "high";
  if (txt.includes("medio") || txt.includes("medium") || txt.includes("riesgo medio")) return "medium";
  return "low";
}

function buildRationale(r: Recommendation, scope: Approval["scope"]) {
  const lines = [
    `Scope: ${scope}`,
    `Title: ${r.title}`,
    `Priority: ${r.priority}`,
    `Advantage: ${r.advantage}`,
    `Risk: ${r.risk}`,
    `Expected: ${r.expected}`,
    `Action: ${r.action}`,
  ];
  return lines.join("\n");
}

export type ApprovalEnvelope = {
  approval: Approval;
  /**
   * Optional rollback payload (kept outside Approval type on purpose).
   * Some parts of the system may attach rollback instructions here.
   */
  rollback?: any;
};

export function buildApprovalRequest(cfg: ProjectConfig, r: Recommendation): ApprovalEnvelope {
  const scope = scopeFromCategory(r.category);

  const approval: Approval = {
    id: `appr_${cfg.projectId}_${now()}`,
    projectId: cfg.projectId,
    scope,
    status: "pending",
    rationale: buildRationale(r, scope),
    limits: {
      // Use guardrails if provided; keep optional.
      maxDailySpendUSD: cfg.guardrails?.maxDailySpendUSD ?? cfg.guardrails?.dailyBudgetUsd ?? undefined,
      maxMonthlySpendUSD: cfg.guardrails?.maxMonthlySpendUSD ?? cfg.guardrails?.monthlyBudgetUsd ?? undefined,
      requireApprovalAboveUSD:
        cfg.guardrails?.requireApprovalAboveUSD ??
        cfg.guardrails?.requiresApprovalAboveUsd ??
        undefined,
    },
    createdAt: now(),
  };

  // If some recommendation carries rollback instructions, expose it separately.
  const rollback = (r as any)?.rollback ?? (r as any)?.guardrailRollback ?? undefined;

  return rollback ? { approval, rollback } : { approval };
}

export function approvalsForRecommendations(cfg: ProjectConfig, recommendations: Recommendation[]): ApprovalEnvelope[] {
  const out: ApprovalEnvelope[] = [];
  for (const r of recommendations) {
    const risk = riskFromRecommendation(r);

    // Basic policy: only require approvals for medium/high risk
    if (risk === "low") continue;

    // If project guardrails say to always require approval above threshold and recommendation has cost impact,
    // still treat it as requiring approval.
    out.push(buildApprovalRequest(cfg, r));
  }
  return out;
}

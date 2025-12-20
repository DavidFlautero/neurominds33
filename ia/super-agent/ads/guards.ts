import type { Guardrails } from "../types";

export function canExecuteAds(guardrails: Guardrails, proposedDailyBudgetUsd: number) {
  // If guardrails are missing critical thresholds, do not allow execution.
  const dailyLimit = guardrails.dailyBudgetUsd ?? guardrails.maxDailySpendUSD;
  const approvalLimit = guardrails.requiresApprovalAboveUsd ?? guardrails.requireApprovalAboveUSD;

  if (typeof dailyLimit !== "number") return false;
  if (typeof approvalLimit !== "number") return false;

  if (proposedDailyBudgetUsd > dailyLimit) return false;
  if (proposedDailyBudgetUsd > approvalLimit) return false;

  return true;
}

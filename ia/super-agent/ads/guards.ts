import type { Guardrails } from "../types";

export function canExecuteAds(guardrails: Guardrails, proposedDailyBudgetUsd: number) {
  if (proposedDailyBudgetUsd > guardrails.dailyBudgetUsd) return false;
  if (proposedDailyBudgetUsd > guardrails.requiresApprovalAboveUsd) return false;
  return true;
}

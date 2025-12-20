export type Guardrails = {
  requireApprovalOverUsd: number;
  maxMonthlySpendUsd: number;
  maxWeeklySpendUsd: number;
  cacMaxUsd?: number;
  noAutoAdsExecution: boolean;
};

export function defaultGuardrails(): Guardrails {
  return {
    requireApprovalOverUsd: 25,
    maxWeeklySpendUsd: 100,
    maxMonthlySpendUsd: 400,
    cacMaxUsd: undefined,
    noAutoAdsExecution: true,
  };
}

export function requiresApproval(amountUsd: number, guardrails: Guardrails) {
  return amountUsd >= guardrails.requireApprovalOverUsd;
}

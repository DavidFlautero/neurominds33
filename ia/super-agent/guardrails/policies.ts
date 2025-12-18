import type { Guardrails, Recommendation } from "../types";

export function requiresApprovalForRecommendation(g: Guardrails, r: Recommendation): boolean {
  if (r.requiresApproval) return true;
  if (r.risk === "high") return true;
  if (r.type === "ADS") return true;
  // Anything unknown or big changes should be gated later with more rules.
  return false;
}

export function enforceBasicGuardrails(r: Recommendation): Recommendation {
  // Ensure rollback exists
  if (!r.rollback?.trigger || !r.rollback?.action) {
    return {
      ...r,
      rollback: {
        trigger: r.rollback?.trigger ?? "Indicador negativo significativo en 24-48h",
        action: r.rollback?.action ?? "Revertir al estado previo / pausar ejecución",
        observationWindow: r.rollback?.observationWindow ?? "48h",
      },
    };
  }
  return r;
}

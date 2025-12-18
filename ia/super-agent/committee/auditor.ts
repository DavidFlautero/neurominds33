import { randomUUID } from "crypto";
import type { ProjectConfig, Recommendation } from "../types";
import { defaultRollbackPlan } from "../guardrails/rollback";
import { enforceBasicGuardrails, requiresApprovalForRecommendation } from "../guardrails/policies";

function riskScore(risk: string) {
  if (risk === "low") return 0;
  if (risk === "medium") return 1;
  return 2;
}
function effortScore(effort: string) {
  if (effort === "S") return 0;
  if (effort === "M") return 1;
  return 2;
}

export function auditorFinalize(cfg: ProjectConfig, recs: Recommendation[]): Recommendation[] {
  const fixed = recs.map((r) => {
    const id = r.id || randomUUID();
    const rollback = r.rollback?.trigger ? r.rollback : defaultRollbackPlan();

    const patched: Recommendation = {
      ...r,
      id,
      rollback,
      requiresApproval: requiresApprovalForRecommendation(cfg.guardrails, r),
    };

    // Respect preferences
    if (cfg.preferences?.noPricingChanges) {
      const text = `${patched.title} ${patched.description}`.toLowerCase();
      if (text.includes("precio") || text.includes("pricing") || text.includes("descuento")) {
        return enforceBasicGuardrails({
          ...patched,
          type: "TECH",
          risk: "high",
          requiresApproval: true,
          nextAction: "CREATE_TASK",
          description:
            patched.description +
            " (Bloqueado por preferencia: noPricingChanges. Convertido en tarea para discusión.)",
        });
      }
    }

    if (cfg.preferences?.noPopups) {
      const text = `${patched.title} ${patched.description}`.toLowerCase();
      if (text.includes("popup") || text.includes("pop-up") || text.includes("modal")) {
        return enforceBasicGuardrails({
          ...patched,
          risk: "medium",
          requiresApproval: true,
          nextAction: "CREATE_TASK",
          description:
            patched.description +
            " (Preferencia: noPopups. Se requiere aprobación explícita.)",
        });
      }
    }

    return enforceBasicGuardrails(patched);
  });

  // Sort: low risk + low effort first (MVP). Later: use economic impact parsing.
  return fixed
    .sort((a, b) => (riskScore(a.risk) + effortScore(a.effort)) - (riskScore(b.risk) + effortScore(b.effort)))
    .slice(0, 12);
}

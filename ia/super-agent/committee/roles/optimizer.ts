import type { RecommendationCategory, RiskLevel } from "../../types";
import type { RoleDraft } from "../consensus";

export async function roleOptimizer(prompts: any): Promise<RoleDraft> {
  const actions: RoleDraft["actions"] = [
    {
      title: "Definir estructura de campañas (Search/PMAX) con límites y plan de escalamiento semanal",
      why: "Estructura correcta evita derroche y acelera ROAS.",
      category: "ADS" as RecommendationCategory,
      risk: "high" as RiskLevel,
      expected: "ROAS objetivo inicial 1.5–2.5x según margen y ticket.",
      requiresApproval: true,
    },
    {
      title: "Configurar guardrails: pausa si CPA sube X% o si gasto diario supera límite",
      why: "Previene quemar presupuesto durante exploración.",
      category: "ADS" as RecommendationCategory,
      risk: "low" as RiskLevel,
      expected: "Menos pérdida por exploración mal calibrada.",
      requiresApproval: false,
    },
  ];

  return {
    note: `Optimizador: foco en ROI y simulación simple. Brief:\n${prompts?.brief ?? ""}`,
    actions,
  };
}

import type { RecommendationCategory, RiskLevel } from "../../types";
import type { RoleDraft } from "../consensus";

export async function roleCreator(prompts: any): Promise<RoleDraft> {
  const actions: RoleDraft["actions"] = [
    {
      title: "Refinar propuesta de valor en H1 + subheadline (beneficio + prueba + CTA)",
      why: "Muchos sitios no explican rápido por qué comprar. Mejor claridad = mejor conversión.",
      category: "CRO" as RecommendationCategory,
      risk: "low" as RiskLevel,
      expected: "+3–10% CVR por claridad de mensaje.",
      requiresApproval: false,
    },
    {
      title: "Crear 3 variantes de creativos (ángulos) para Ads: dolor→solución, prueba social, oferta limitada",
      why: "Necesitás testing creativo desde el día 1; el rendimiento suele venir de ángulo+mensaje.",
      category: "ADS" as RecommendationCategory,
      risk: "medium" as RiskLevel,
      expected: "Mejor CTR y aprendizaje más rápido.",
      requiresApproval: true,
    },
  ];

  return {
    note: `Creadora: foco en mensaje y creatividad. Brief:\n${prompts?.brief ?? ""}`,
    actions,
  };
}

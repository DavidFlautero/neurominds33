import type { RecommendationCategory, RiskLevel } from "../../types";
import type { RoleDraft } from "../consensus";

export async function roleAnalyst(prompts: any): Promise<RoleDraft> {
  const actions: RoleDraft["actions"] = [
    {
      title: "Verificar tracking base (GA4/Events) y eventos clave (view_item, add_to_cart, begin_checkout, purchase)",
      why: "Sin medición consistente, cualquier optimización de Ads es ciega. Primero instrumentación.",
      category: "ANALYTICS" as RecommendationCategory,
      risk: "low" as RiskLevel,
      expected: "Datos confiables → decisiones correctas (impacto indirecto alto).",
      requiresApproval: false,
    },
    {
      title: "Mejorar velocidad percibida (LCP/CLS) en home + landing principal",
      why: "Tiempo de carga y estabilidad visual afectan CVR y CPC efectivo.",
      category: "UX" as RecommendationCategory,
      risk: "medium" as RiskLevel,
      expected: "+5–15% CVR (depende del baseline).",
      requiresApproval: false,
    },
  ];

  return {
    note: `Analista: foco en medición y eficiencia. Brief:\n${prompts?.brief ?? ""}`,
    actions,
  };
}

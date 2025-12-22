import type { Quote, Recommendation } from "../types";

/**
 * Quotes workflow (v1)
 * - Generates 1 Quote per Recommendation (simple + predictable).
 * - Uses Quote fields from types/index.ts (no extra props like `items`).
 */

function estimatePrice(rec: Recommendation): number {
  // Simple heuristic by priority and category.
  const base =
    rec.category === "ADS" ? 220 :
    rec.category === "LANDING" ? 260 :
    rec.category === "SEO" ? 180 :
    rec.category === "UX" || rec.category === "CRO" ? 200 :
    150;

  const mult = rec.priority === 1 ? 1.6 : rec.priority === 2 ? 1.2 : 1.0;
  return Math.round(base * mult);
}

function defaultTimeline(rec: Recommendation): string {
  if (rec.priority === 1) return "24–72 horas";
  if (rec.priority === 2) return "3–7 días";
  return "1–2 semanas";
}

function safeText(s: unknown, fallback: string) {
  const t = typeof s === "string" ? s.trim() : "";
  return t.length ? t : fallback;
}

export function buildQuoteForRecommendation(projectId: string, rec: Recommendation): Quote {
  const price = estimatePrice(rec);

  return {
    id: `q_${rec.id}`,
    projectId,
    recommendationId: rec.id,

    title: `Implementar: ${safeText(rec.title, "Mejora recomendada")}`,
    description: safeText(
      rec.detail,
      "Implementación y validación de la mejora recomendada por el Super Agent."
    ),

    currency: "USD",
    price,

    includes: [
      "Implementación técnica",
      "Validación post-cambio",
      "Rollback plan (si aplica)",
      "Reporte de impacto esperado",
    ],
    timeline: defaultTimeline(rec),

    risks: [safeText(rec.risk, "Riesgo bajo/medio según contexto del sitio.")],
    expected: [safeText(rec.expected, "Mejora incremental en performance/convertibilidad.")],

    status: "draft",
    createdAt: Date.now(),
  };
}

export function buildQuotes(projectId: string, recommendations: Recommendation[]): Quote[] {
  return (recommendations || []).map((r) => buildQuoteForRecommendation(projectId, r));
}

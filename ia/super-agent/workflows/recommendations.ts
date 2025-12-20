import type { Recommendation, RecommendationCategory, RiskLevel } from "../types";

function id(prefix = "rec") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function toRisk(v: any): RiskLevel {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("high") || s.includes("alto")) return "high";
  if (s.includes("medium") || s.includes("medio")) return "medium";
  return "low";
}

function toCategory(v: any): RecommendationCategory {
  const s = String(v ?? "").toUpperCase();
  if (s.includes("SEO")) return "SEO";
  if (s.includes("UX")) return "UX";
  if (s.includes("ADS")) return "ADS";
  if (s.includes("ANALYTICS")) return "ANALYTICS";
  if (s.includes("COMPETITOR")) return "COMPETITOR";
  return "CRO";
}

function toPriority(v: any, risk: RiskLevel): number {
  // priority: 1 = alta, 2 = media, 3 = baja (como veníamos usando)
  if (typeof v === "number" && Number.isFinite(v)) return Math.min(3, Math.max(1, v));
  if (risk === "high") return 1;
  if (risk === "medium") return 2;
  return 3;
}

/**
 * normalizeRecommendations
 * Takes committee output (or any mixed list) and returns clean Recommendation[]
 * so UI/store have stable shape.
 */
export function normalizeRecommendations(args: {
  projectId: string;
  input: any;
}): Recommendation[] {
  const { projectId, input } = args;

  const list: any[] = Array.isArray(input)
    ? input
    : Array.isArray(input?.recommendations)
      ? input.recommendations
      : Array.isArray(input?.actions)
        ? input.actions
        : [];

  const now = Date.now();

  return list.map((raw) => {
    const title =
      raw?.title ??
      raw?.name ??
      raw?.action ??
      raw?.task ??
      "Recomendación";

    const detail =
      raw?.detail ??
      raw?.why ??
      raw?.description ??
      raw?.notes ??
      "";

    const category = toCategory(raw?.category ?? raw?.type);
    const risk = toRisk(raw?.risk);
    const expected =
      raw?.expected ??
      raw?.impacto_esperado ??
      raw?.resultado_esperado ??
      "";

    const advantage =
      raw?.advantage ??
      raw?.benefit ??
      "Mejora performance y reduce fricción.";

    const riskText =
      raw?.riskText ??
      raw?.riesgo ??
      (risk === "high"
        ? "Riesgo alto: requiere validación/rollback."
        : risk === "medium"
          ? "Riesgo medio: validar antes de escalar."
          : "Riesgo bajo: cambio seguro.");

    const priority = toPriority(raw?.priority, risk);

    const action =
      raw?.action ??
      raw?.whatToChange ??
      raw?.change ??
      title;

    const rec: Recommendation = {
      id: raw?.id ?? id("rec"),
      projectId,
      category,
      title: String(title),
      detail: String(detail),
      advantage: String(advantage),
      risk: String(riskText),
      expected: String(expected),
      priority,
      action: String(action),
      createdAt: raw?.createdAt ?? now,
    };

    return rec;
  });
}

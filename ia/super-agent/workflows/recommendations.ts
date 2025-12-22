import type { Priority, Recommendation, RecommendationCategory } from "../types";

/**
 * Normaliza cualquier salida (LLM / committee / heuristics) a Recommendation[]
 * - tipado estable
 * - priority siempre 1|2|3
 * - strings siempre saneados
 */
function asString(v: any, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "string") return v.trim();
  try {
    return String(v).trim();
  } catch {
    return fallback;
  }
}

function asCategory(v: any): RecommendationCategory {
  const s = asString(v, "").toUpperCase();
  const allowed: RecommendationCategory[] = ["SEO", "UX", "CRO", "ADS", "COMPETITOR", "LANDING", "ANALYTICS"];
  const hit = allowed.find((x) => x === (s as any));
  return hit ?? "UX";
}

function asPriority(v: any): Priority {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return 2;
  if (n <= 1) return 1;
  if (n >= 3) return 3;
  return 2;
}

function makeId(prefix = "rec"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function normalizeRecommendations(input: { projectId: string; input: any }): Recommendation[] {
  const projectId = String(input?.projectId ?? "local");
  const raw = input?.input;

  // Acepta múltiples shapes: { recommendations: [...] } | [...] | {items:[...]}
  const list: any[] =
    (raw?.recommendations && Array.isArray(raw.recommendations) ? raw.recommendations : null) ??
    (raw?.items && Array.isArray(raw.items) ? raw.items : null) ??
    (Array.isArray(raw) ? raw : []);

  const now = Date.now();

  return list
    .map((r: any) => {
      const category = asCategory(r?.category ?? r?.type ?? r?.area);
      const title = asString(r?.title ?? r?.name ?? "Recomendación");
      const detail = asString(r?.detail ?? r?.description ?? r?.why ?? "");
      const advantage = asString(r?.advantage ?? r?.benefit ?? "Mejora esperada en performance y conversiones.");
      const riskText = asString(r?.risk ?? r?.downside ?? "Riesgo bajo si se implementa correctamente.");
      const expected = asString(r?.expected ?? r?.result ?? "Impacto positivo incremental.");
      const action = asString(r?.action ?? r?.change ?? r?.do ?? "Aplicar ajuste recomendado.");
      const priority: Priority = asPriority(r?.priority ?? r?.prio ?? r?.importance ?? 2);

      const rec: Recommendation = {
        id: asString(r?.id, "") || makeId("rec"),
        projectId,
        scanId: r?.scanId ? String(r.scanId) : undefined,
        category,
        title,
        detail,
        advantage,
        risk: riskText,
        expected,
        priority,
        action,
        impact: r?.impact && typeof r.impact === "object" ? r.impact : undefined,
        createdAt: typeof r?.createdAt === "number" ? r.createdAt : now,
      };

      return rec;
    })
    .filter((x) => !!x.title);
}

import type { ProjectConfig, Recommendation, WeeklyPlan, ScanArtifact } from "../types";

/**
 * auditorSynthesizePlan (v1)
 * Convierte consenso en:
 * - WeeklyPlan estable para UI
 * - Recomendaciones finales (normalizadas)
 * - Notas de comité
 */
export async function auditorSynthesizePlan(args: {
  cfg: ProjectConfig;
  scan: ScanArtifact;
  consensus: any;
}): Promise<{
  plan: WeeklyPlan;
  recommendations: Recommendation[];
  notes: Record<string, string>;
}> {
  const { cfg, scan, consensus } = args;

  const recs: Recommendation[] = (consensus?.recommendations ?? consensus?.recs ?? []).filter(Boolean);

  // Si consenso trae acciones explícitas, úsalas. Si no, derivamos acciones desde recomendaciones.
  const actions =
    (consensus?.actions ?? []).length > 0
      ? consensus.actions
      : recs.slice(0, 10).map((r) => ({
          id: r.id,
          title: r.title,
          description: r.detail,
          category: r.category,
          priority: r.priority,
          owner: "agent",
          status: "pending",
        }));

  const headline =
    consensus?.headline ??
    `Plan semanal v1: ${cfg?.name ? cfg.name : cfg.projectId} (adsReady=${String(scan?.adsReady ?? "?" )})`;

  const plan: WeeklyPlan = {
    projectId: cfg.projectId,
    weekOf: Date.now(),
    headline,
    actions,
    notes: {
      ...(consensus?.notes ?? {}),
      auditor: String(consensus?.auditorNote ?? ""),
    },
  };

  const notes: Record<string, string> = {
    ...(consensus?.notes ?? {}),
    auditor: String(consensus?.auditorNote ?? ""),
  };

  return { plan, recommendations: recs, notes };
}

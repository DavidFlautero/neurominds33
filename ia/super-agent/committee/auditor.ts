import type { ProjectConfig, Recommendation, WeeklyPlan } from "../types";

/**
 * Auditor: arma un WeeklyPlan compatible con el type actual.
 * - WeeklyPlan: { projectId?, weekOf, headline, actions, notes? }
 * - Evita campos legacy: weekStart, summary, committeeNotes, etc.
 */
export async function auditorReview(
  cfg: ProjectConfig,
  consensus: {
    recommendations: Recommendation[];
    actions: any[];
    notes?: {
      analyst?: string;
      creator?: string;
      optimizer?: string;
      auditor?: string;
    };
    headline?: string;
  }
): Promise<{ plan: WeeklyPlan; recommendations: Recommendation[]; notes: Record<string, string> }> {
  const weekOf = Date.now();

  const headline =
    consensus.headline ??
    "Plan semanal (v1) — Acciones priorizadas + riesgos/ventajas";

  // Normalizamos notas del comité a Record<string,string> para UI
  const notes: Record<string, string> = {
    analyst: consensus.notes?.analyst ?? "",
    creator: consensus.notes?.creator ?? "",
    optimizer: consensus.notes?.optimizer ?? "",
    auditor: consensus.notes?.auditor ?? "",
  };

  const plan: WeeklyPlan = {
    projectId: cfg.projectId,
    weekOf,
    headline,
    // Si tu consensus.actions no es PlanAction[] aún, no lo forces: castea.
    actions: (consensus.actions ?? []) as any,
    notes,
  };

  return {
    plan,
    recommendations: consensus.recommendations ?? [],
    notes,
  };
}

/**
 * Backward-compatible export (legacy name expected by committee/index.ts)
 */
export const auditorSynthesizePlan = auditorReview;

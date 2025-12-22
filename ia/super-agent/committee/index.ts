import type { ProjectConfig, Recommendation, ScanArtifact, WeeklyPlan } from "../types";
import { auditorSynthesizePlan } from "./auditor";
import { runConsensus } from "./consensus";
import { buildCommitteePrompts } from "./prompts";
import { roleAnalyst } from "./roles/analyst";
import { roleCreator } from "./roles/creator";
import { roleOptimizer } from "./roles/optimizer";

/**
 * committeeRun (v1)
 * Orquesta comité multi-rol y sintetiza un plan semanal.
 *
 * IMPORTANTE:
 * - buildCommitteePrompts() acepta un solo argumento: { cfg, scan }
 * - runConsensus() acepta: { cfg, analyst, creator, optimizer }
 * - auditorSynthesizePlan() acepta SOLO: { cfg, scan, consensus }
 */
export async function committeeRun(
  cfg: ProjectConfig,
  scan: ScanArtifact
): Promise<{
  plan: WeeklyPlan;
  recommendations: Recommendation[];
  notes: Record<string, string>;
}> {
  const prompts = buildCommitteePrompts({ cfg, scan });

  // Roles
  const analyst: any = await roleAnalyst(prompts);
  const creator: any = await roleCreator(prompts);
  const optimizer: any = await roleOptimizer(prompts);

  // Notes para UI/debug
  const notes: Record<string, string> = {
    analyst: String(analyst?.note ?? ""),
    creator: String(creator?.note ?? ""),
    optimizer: String(optimizer?.note ?? ""),
  };

  // Recos aportadas por roles (si existen)
  const roleRecommendations: Recommendation[] = [
    ...(Array.isArray(analyst?.recommendations) ? analyst.recommendations : []),
    ...(Array.isArray(creator?.recommendations) ? creator.recommendations : []),
    ...(Array.isArray(optimizer?.recommendations) ? optimizer.recommendations : []),
  ].filter(Boolean) as Recommendation[];

  // Consenso (firma real)
  const consensus: any = await runConsensus({
    cfg,
    analyst,
    creator,
    optimizer,
  });

  // Auditor (firma real: NO recibe recommendations/notes)
  const audited: any = await auditorSynthesizePlan({
    cfg,
    scan,
    consensus,
  });

  // Si el auditor devuelve recomendaciones, se combinan con las de roles
  const auditorRecommendations: Recommendation[] = Array.isArray(audited?.recommendations)
    ? audited.recommendations
    : [];

  return {
    plan: audited?.plan as WeeklyPlan,
    recommendations: [...roleRecommendations, ...auditorRecommendations],
    notes: {
      ...notes,
      auditor: String(audited?.note ?? audited?.auditorNote ?? ""),
    },
  };
}

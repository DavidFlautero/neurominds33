import type { ProjectConfig, Recommendation, ScanArtifact, WeeklyPlan } from "../types";
import { auditorSynthesizePlan } from "./auditor";
import { runConsensus } from "./consensus";
import { buildCommitteePrompts } from "./prompts";
import { roleAnalyst } from "./roles/analyst";
import { roleCreator } from "./roles/creator";
import { roleOptimizer } from "./roles/optimizer";

/**
 * committeeRun (v1)
 * - Genera opiniones por rol (Analyst/Creator/Optimizer)
 * - Ejecuta un consenso liviano
 * - Auditor sintetiza un WeeklyPlan + recomendaciones normalizadas
 *
 * Nota: mantenemos tipado "seguro" pero tolerante (algunos roles pueden devolver any).
 */
export async function committeeRun(
  cfg: ProjectConfig,
  scan: ScanArtifact
): Promise<{
  plan: WeeklyPlan;
  recommendations: Recommendation[];
  notes: Record<string, string>;
}> {
  const prompts = buildCommitteePrompts(cfg, scan);

  // Roles (tolerantes)
  const analystDraft: any = await roleAnalyst(prompts);
  const creatorDraft: any = await roleCreator(prompts);
  const optimizerDraft: any = await roleOptimizer(prompts);

  const roleNotes: Record<string, string> = {
    analyst: String(analystDraft?.note ?? ""),
    creator: String(creatorDraft?.note ?? ""),
    optimizer: String(optimizerDraft?.note ?? ""),
  };

  // Recomendaciones propuestas por roles (si no hay, cae a [])
  const roleRecommendations: Recommendation[] = [
    ...(analystDraft?.recommendations ?? []),
    ...(creatorDraft?.recommendations ?? []),
    ...(optimizerDraft?.recommendations ?? []),
  ].filter(Boolean);

  // Consenso (acciones + ajustes)
  const consensus: any = await runConsensus({
    cfg,
    scan,
    recommendations: roleRecommendations,
    notes: roleNotes,
  });

  // Auditor: plan final + recomendaciones finales
  const audited = await auditorSynthesizePlan({
    cfg,
    scan,
    consensus,
  });

  return {
    plan: audited.plan,
    recommendations: audited.recommendations,
    notes: audited.notes,
  };
}

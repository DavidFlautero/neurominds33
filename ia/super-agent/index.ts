import type { ProjectConfig, WeeklyPlan } from "./types";
import { runScan } from "./scan-engine/capture";
import { recordCriticalFlow } from "./scan-engine/recordFlow";
import { committeeRun } from "./committee";
import { normalizeRecommendations } from "./workflows/recommendations";

export async function runFullSuperAgentScan(cfg: ProjectConfig) {
  const scan = await runScan(cfg);
  const flow = await recordCriticalFlow(cfg);
  scan.flowRecording = flow;

  const recommendations = normalizeRecommendations(await committeeRun(cfg, scan));

  return { scan, recommendations };
}

export async function buildWeeklyPlan(cfg: ProjectConfig, scanArtifact: any): Promise<WeeklyPlan> {
  const scan = scanArtifact;
  const recommendations = normalizeRecommendations(await committeeRun(cfg, scan));

  return {
    projectId: cfg.projectId,
    weekOf: new Date().toISOString().slice(0, 10),
    topActions: recommendations.slice(0, 5),
    rationale:
      "Plan generado por comité (Analista/Creadora/Optimizadora) + Auditor, con guardrails y rollback por acción.",
  };
}

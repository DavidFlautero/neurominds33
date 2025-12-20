import type { ProjectConfig, WeeklyPlan } from "./types";
import { runScan } from "./scan-engine/capture";
import { recordCriticalFlow } from "./scan-engine/recordFlow";
import { committeeRun } from "./committee";
import { normalizeRecommendations } from "./workflows/recommendations";

export async function runFullSuperAgentScan(cfg: ProjectConfig) {
  const scan = await runScan(cfg);
  const flow = await recordCriticalFlow(cfg);
  const scanWithFlow = ({ ...scan, flowRecording: flow } as any);

const recommendations = normalizeRecommendations(await committeeRun(cfg, scanWithFlow));

  return { scan: scanWithFlow, recommendations };
}

export async function buildWeeklyPlan(cfg: ProjectConfig, scanArtifact: any): Promise<WeeklyPlan> {
  const scan = scanArtifact;
  const recommendations = normalizeRecommendations(await committeeRun(cfg, scanWithFlow));

  return {
    projectId: cfg.projectId,
    weekOf: new Date().toISOString().slice(0, 10),
    topActions: recommendations.slice(0, 5),
    rationale:
      "Plan generado por comité (Analista/Creadora/Optimizadora) + Auditor, con guardrails y rollback por acción.",
  };
}

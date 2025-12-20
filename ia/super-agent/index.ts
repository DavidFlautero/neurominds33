import type { ProjectConfig, WeeklyPlan } from "./types";
import { runScan } from "./scan-engine/capture";
import { recordCriticalFlow } from "./scan-engine/recordFlow";
import { committeeRun } from "./committee";
import { normalizeRecommendations } from "./workflows/recommendations";

/**
 * Full scan pipeline:
 * 1) Scan (HTML/SEO/UX/Ads readiness)
 * 2) Record critical flow (optional artifact)
 * 3) Committee decision
 * 4) Normalize recommendations for UI/store
 */
export async function runFullSuperAgentScan(cfg: ProjectConfig) {
  const scan = await runScan(cfg);
  const flow = await recordCriticalFlow(cfg);

  // Don't mutate ScanArtifact type; attach extra artifact safely.
  const scanWithFlow = ({ ...scan, flowRecording: flow } as any);

  const committee = await committeeRun(cfg, scanWithFlow);

  const projectId =
    (cfg as any).projectId ??
    (cfg as any).id ??
    (cfg as any).name ??
    "demo-project";

  const recommendations = normalizeRecommendations({
    projectId: String(projectId),
    input: committee,
  });

  return { scan: scanWithFlow, recommendations, committee };
}

/**
 * Build weekly plan from scan + committee.
 * For now, committeeRun already returns plan in some implementations.
 * This function keeps a stable API surface for your dashboard.
 */
export async function buildWeeklyPlan(cfg: ProjectConfig, scanArtifact: any): Promise<WeeklyPlan> {
  const committee = await committeeRun(cfg, scanArtifact);
  return (committee as any)?.plan ?? {
    weekOf: Date.now(),
    headline: "Plan semanal (v1)",
    actions: [],
    notes: {},
  };
}

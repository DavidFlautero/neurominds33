import type { ProjectConfig, Recommendation, ScanArtifact, WeeklyPlan } from "../types";

function id(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function auditorSynthesizePlan(args: {
  cfg: ProjectConfig;
  scan: ScanArtifact;
  consensus: { actions: WeeklyPlan["actions"] };
  roleNotes: { analyst: string; creator: string; optimizer: string };
}): { plan: WeeklyPlan; recommendations: Recommendation[]; auditorNote: string } {
  const { cfg, scan, consensus, roleNotes } = args;

  const weekStart = new Date();
  // normalize to YYYY-MM-DD (local)
  const iso = new Date(weekStart.getTime() - weekStart.getTimezoneOffset() * 60000).toISOString();
  const weekStartStr = iso.slice(0, 10);

  const summary =
    `Plan semanal generado desde el diagnóstico inicial (Scan v1). ` +
    `Prioriza impacto rápido y bajo riesgo antes de escalar Ads.`;

  const plan: WeeklyPlan = {
    projectId: cfg.projectId,
    weekStart: weekStartStr,
    summary,
    actions: consensus.actions,
    committeeNotes: {
      analyst: roleNotes.analyst,
      creator: roleNotes.creator,
      optimizer: roleNotes.optimizer,
      auditor: "Aprobé un plan conservador→agresivo: primero base (tracking/UX), luego escala Ads.",
    },
  };

  const recommendations: Recommendation[] = consensus.actions.map((a) => ({
    id: id("rec"),
    projectId: cfg.projectId,
    category: a.category,
    title: a.title,
    detail: a.why,
    advantage: "Mejora directa en performance/claridad y reduce fricción.",
    risk: a.risk === "high" ? "Puede afectar conversiones si se aplica sin validar." : "Riesgo controlable con validación.",
    expected: a.expected,
    priority: a.risk === "high" ? 3 : a.risk === "medium" ? 2 : 1,
    action: a.title,
    createdAt: Date.now(),
  }));

  const auditorNote =
    `Auditor: scan seoScore=${scan.seoScore ?? "?"}, uxScore=${scan.uxScore ?? "?"}, adsReady=${scan.adsReady ?? "?"}. ` +
    `Se generan ${recommendations.length} acciones priorizadas.`;

  return { plan, recommendations, auditorNote };
}

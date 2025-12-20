import { CommitteeConsensus, CommitteeInput, SAPlan } from "@/ia/super-agent/types/core";
import { buildConsensus, computeScore } from "@/ia/super-agent/committee/consensus";

export function buildPlanFromCommittee(input: CommitteeInput, opinions: any[]): SAPlan {
  const consensus: CommitteeConsensus = buildConsensus(opinions);
  const score = computeScore(opinions, consensus);

  const siteUrl = input.project?.siteUrl || input.context?.siteUrl || "";
  const hasSync = Boolean(siteUrl) && Boolean(input.projectId);
  const hasContext = Boolean(input.context);
  const hasScan = Boolean(input.scan);

  const status =
    !hasSync ? "needs_sync" :
    !hasContext ? "needs_context" :
    !hasScan ? "needs_scan" : "ready";

  const adsReadiness =
    input.scan?.adsReadiness?.apt === true ? "ok" :
    input.scan?.adsReadiness?.apt === false ? "no" : "partial";

  const headline =
    status !== "ready"
      ? "Completa el flujo para generar un plan serio."
      : adsReadiness === "ok"
        ? "Tu base está lista para campañas, pero primero ejecutemos quick wins."
        : adsReadiness === "no"
          ? "No está listo para Ads aún: arreglamos tracking/landing primero."
          : "Listo para optimizar: priorizamos conversión y fundamentos.";

  // Week slicing: simple strategy
  const top = consensus.topActions;
  const week1 = top.slice(0, 4);
  const week2 = top.slice(4, 8);
  const week3 = top.slice(8, 12);

  return {
    projectId: input.projectId,
    generatedAt: Date.now(),
    summary: {
      status,
      score,
      adsReadiness,
      headline,
    },
    weeks: [
      { week: 1, goals: ["Corregir fundamentos y quick wins"], actions: week1 },
      { week: 2, goals: ["Optimización de oferta y landing/UX"], actions: week2 },
      { week: 3, goals: ["Preparar tests y escalamiento controlado"], actions: week3 },
      { week: 4, goals: ["Consolidar aprendizaje y siguiente ciclo"], actions: [] },
    ],
    committee: {
      opinions,
      consensus,
    },
  };
}

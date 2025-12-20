import { appendJSONL, readJSONL } from "@/lib/super-agent/storage/jsonlStore";
import type { ProposalEvent, DecisionEvent, OutcomeEvent, LearningLabel } from "./events";

const PROPOSALS = "learning_proposals.jsonl";
const DECISIONS = "learning_decisions.jsonl";
const OUTCOMES = "learning_outcomes.jsonl";
const LABELS = "learning_labels.jsonl";

export async function recordProposal(ev: ProposalEvent) {
  await appendJSONL(PROPOSALS, ev);
  return ev;
}

export async function recordDecision(ev: DecisionEvent) {
  await appendJSONL(DECISIONS, ev);
  return ev;
}

export async function recordOutcome(ev: OutcomeEvent) {
  await appendJSONL(OUTCOMES, ev);
  // auto-label
  const label = await autoLabel(ev.projectId, ev.proposalId);
  if (label) await appendJSONL(LABELS, label);
  return { outcome: ev, label };
}

export async function getProjectLearning(projectId: string) {
  const proposals = (await readJSONL(PROPOSALS, 2000)).filter((x) => x.projectId === projectId);
  const decisions = (await readJSONL(DECISIONS, 2000)).filter((x) => x.projectId === projectId);
  const outcomes = (await readJSONL(OUTCOMES, 2000)).filter((x) => x.projectId === projectId);
  const labels = (await readJSONL(LABELS, 2000)).filter((x) => x.projectId === projectId);
  return { proposals, decisions, outcomes, labels };
}

async function autoLabel(projectId: string, proposalId: string): Promise<LearningLabel | null> {
  const { decisions, outcomes } = await getProjectLearning(projectId);
  const d = decisions.reverse().find((x: any) => x.proposalId === proposalId) as any | undefined;
  const o = outcomes.reverse().find((x: any) => x.proposalId === proposalId) as any | undefined;

  if (!o) return null;

  // Simple heuristics (robusto, sin ML todavía)
  const delta = o.delta || {};
  const keys = Object.keys(delta);
  const lift = keys.reduce((a, k) => a + (typeof delta[k] === "number" ? delta[k] : 0), 0);

  let label: LearningLabel["label"] = "unknown";
  let summary = "Sin suficiente señal.";

  if (d?.action === "approved" && lift > 0) {
    label = "as_expected";
    summary = "Aprobado y mejoró KPI agregado.";
  } else if (d?.action === "approved" && lift < 0) {
    label = "too_risky";
    summary = "Aprobado pero empeoró KPI agregado.";
  } else if (d?.action === "rejected" && lift > 0) {
    label = "human_improved";
    summary = "Rechazado; el baseline/post sugiere que el humano evitó riesgo o eligió mejor timing.";
  } else if (d?.action === "modified" && lift > 0) {
    label = "human_improved";
    summary = "Modificado por humano y mejoró el KPI.";
  }

  return {
    projectId,
    proposalId,
    labeledAt: Date.now(),
    label,
    summary,
  };
}

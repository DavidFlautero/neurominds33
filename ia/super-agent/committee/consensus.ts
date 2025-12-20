import { CommitteeOpinion, CommitteeConsensus, SAAction } from "@/ia/super-agent/types/core";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function scoreAction(a: SAAction) {
  // Heuristic scoring: higher priority + bigger expected delta + lower risk + smaller effort.
  const effortPenalty = a.effort === "S" ? 0 : a.effort === "M" ? 1 : 2;
  const riskPenalty = a.risk.level === "low" ? 0 : a.risk.level === "medium" ? 1 : 2;
  const base = (6 - a.priority) * 2; // priority 1 is best
  const total = base - effortPenalty - riskPenalty;
  return total;
}

export function buildConsensus(opinions: CommitteeOpinion[]): CommitteeConsensus {
  const allActions = opinions.flatMap(o => o.suggestedActions || []);
  const redFlags = opinions.flatMap(o => o.redFlags || []);

  // Deduplicate by title
  const map = new Map<string, SAAction>();
  for (const a of allActions) {
    const key = a.title.trim().toLowerCase();
    const prev = map.get(key);
    if (!prev) map.set(key, a);
    else {
      // keep higher priority (lower number), merge why/how
      const merged: SAAction = {
        ...prev,
        priority: (Math.min(prev.priority, a.priority) as any),
        effort: prev.effort === "S" ? "S" : a.effort, // keep smaller if present
        why: Array.from(new Set([...(prev.why || []), ...(a.why || [])])),
        how: Array.from(new Set([...(prev.how || []), ...(a.how || [])])),
      };
      map.set(key, merged);
    }
  }

  const unique = Array.from(map.values());
  unique.sort((a,b) => scoreAction(b) - scoreAction(a));

  const blockers = redFlags.filter(r => /block|no\s?tracking|policy|broken/i.test(r));
  const decision = blockers.length ? "revise" : unique.length ? "approve" : "revise";

  return {
    decision,
    topActions: unique.slice(0, 12),
    rationale: [
      "Actions selected by consensus: priority, expected impact, risk, and effort.",
      "Weak ideas removed; safety-first for Ads (no auto execution)."
    ],
    blockers: blockers.slice(0, 6),
    warnings: redFlags.filter(r => !blockers.includes(r)).slice(0, 8),
  };
}

export function computeScore(opinions: CommitteeOpinion[], consensus: CommitteeConsensus) {
  // Score 0..100 rough
  const base = consensus.topActions.length ? 55 : 30;
  const blockerPenalty = consensus.blockers.length * 6;
  const warningPenalty = consensus.warnings.length * 2;

  const avgConfidence = opinions.length
    ? opinions.reduce((s,o)=>s+clamp(o.score.confidence,1,10),0) / opinions.length
    : 5;

  const confidenceBoost = (avgConfidence - 5) * 5; // -20..+25
  return clamp(Math.round(base - blockerPenalty - warningPenalty + confidenceBoost), 0, 100);
}

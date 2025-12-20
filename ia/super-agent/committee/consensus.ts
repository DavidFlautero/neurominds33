import type { ProjectConfig, RecommendationCategory, RiskLevel } from "../types";

export type RoleDraft = {
  note: string;
  actions: Array<{
    title: string;
    why: string;
    category: RecommendationCategory;
    risk: RiskLevel;
    expected: string;
    requiresApproval: boolean;
  }>;
};

export function runConsensus(args: {
  analyst: RoleDraft;
  creator: RoleDraft;
  optimizer: RoleDraft;
  cfg: ProjectConfig;
}) {
  const { analyst, creator, optimizer } = args;

  // v1: merge + simple dedupe by title
  const merged = [...analyst.actions, ...creator.actions, ...optimizer.actions];

  const seen = new Set<string>();
  const actions = merged.filter((a) => {
    const key = a.title.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Keep it tight: first 6 actions
  return { actions: actions.slice(0, 6) };
}

import type { ProjectConfig, Recommendation, WeeklyPlan, ScanArtifact } from "../types";
import { auditorSynthesizePlan } from "./auditor";
import { runConsensus } from "./consensus";
import { buildCommitteePrompts } from "./prompts";
import { roleAnalyst } from "./roles/analyst";
import { roleCreator } from "./roles/creator";
import { roleOptimizer } from "./roles/optimizer";

/**
 * committeeRun
 * - Generates role opinions (Analyst/Creator/Optimizer)
 * - Runs a lightweight consensus
 * - Auditor produces a WeeklyPlan + normalized recommendations
 *
 * This is v1 "free + robust" committee: local logic + LLM hooks can be added later.
 */
export async function committeeRun(args: {
  cfg: ProjectConfig;
  scan: ScanArtifact;
  context?: Record<string, unknown>;
}): Promise<{
  plan: WeeklyPlan;
  recommendations: Recommendation[];
  notes: { analyst: string; creator: string; optimizer: string; auditor: string };
}> {
  const { cfg, scan, context } = args;

  const prompts = buildCommitteePrompts({ cfg, scan, context });

  // Role drafts (these functions may be deterministic today; later you swap in LLM calls)
  const analystDraft = await roleAnalyst(prompts);
  const creatorDraft = await roleCreator(prompts);
  const optimizerDraft = await roleOptimizer(prompts);

  // Consensus -> proposed actions list (titles + why + risk + expected + requiresApproval)
  const consensus = runConsensus({
    analyst: analystDraft,
    creator: creatorDraft,
    optimizer: optimizerDraft,
    cfg,
  });

  // Auditor final plan + recommendations
  const { plan, recommendations, auditorNote } = auditorSynthesizePlan({
    cfg,
    scan,
    consensus,
    roleNotes: {
      analyst: analystDraft.note,
      creator: creatorDraft.note,
      optimizer: optimizerDraft.note,
    },
  });

  return {
    plan,
    recommendations,
    notes: {
      analyst: analystDraft.note,
      creator: creatorDraft.note,
      optimizer: optimizerDraft.note,
      auditor: auditorNote,
    },
  };
}

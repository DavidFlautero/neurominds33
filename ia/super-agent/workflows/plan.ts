import { CommitteeInput, SAPlan } from "@/ia/super-agent/types/core";
import { runCommittee } from "@/ia/super-agent/committee";
import { buildPlanFromCommittee } from "@/ia/super-agent/committee/auditor";

export function generatePlan(input: CommitteeInput): SAPlan {
  const opinions = runCommittee(input);
  return buildPlanFromCommittee(input, opinions);
}

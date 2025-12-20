import { CommitteeInput, CommitteeOpinion } from "@/ia/super-agent/types/core";
import { analystOpinion } from "@/ia/super-agent/committee/roles/analyst";
import { creatorOpinion } from "@/ia/super-agent/committee/roles/creator";
import { optimizerOpinion } from "@/ia/super-agent/committee/roles/optimizer";

export function runCommittee(input: CommitteeInput): CommitteeOpinion[] {
  // Heuristic committee (free, no external API). Later we can swap each role to Gemini/DeepSeek etc.
  const opinions: CommitteeOpinion[] = [];
  opinions.push(analystOpinion(input));
  opinions.push(creatorOpinion(input));
  opinions.push(optimizerOpinion(input));
  return opinions;
}

import { baseContext, outputContract } from "../prompts";
import type { ProjectConfig, ScanArtifact } from "../../types";

/**
 * MVP: returns prompt string.
 * Next step: replace with callLLM(prompt, model="...") that returns JSON.
 */
export async function analystRole(cfg: ProjectConfig, scan: ScanArtifact): Promise<string> {
  return `
Sos IA Analista (data-driven, pesimista, anti-riesgo). Priorizás eficiencia y minimizar pérdida.
${baseContext(cfg, scan)}
Generá recomendaciones enfocadas a embudo, CRO, tracking, performance y quick wins.
Incluí rollback plan y respetá guardrails.
${outputContract}
`;
}

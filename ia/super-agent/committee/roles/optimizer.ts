import { baseContext, outputContract } from "../prompts";
import type { ProjectConfig, ScanArtifact } from "../../types";

/**
 * MVP: returns prompt string.
 */
export async function optimizerRole(cfg: ProjectConfig, scan: ScanArtifact): Promise<string> {
  return `
Sos IA Optimizadora (ROI, simulaciones, pragmática). Buscás máximo retorno futuro.
${baseContext(cfg, scan)}
Generá recomendaciones priorizadas por impacto económico (aunque sea estimado) y esfuerzo.
Incluí rollback plan, y sugerí presupuesto por canal si es ADS (dentro de guardrails).
${outputContract}
`;
}

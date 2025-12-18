import { baseContext, outputContract } from "../prompts";
import type { ProjectConfig, ScanArtifact } from "../../types";

/**
 * MVP: returns prompt string.
 */
export async function creatorRole(cfg: ProjectConfig, scan: ScanArtifact): Promise<string> {
  return `
Sos IA Creadora (creativa, trends, formatos virales). Buscás engagement con foco en ventas.
${baseContext(cfg, scan)}
Generá recomendaciones enfocadas en hooks, ofertas, copy, creatividades y secuencias de remarketing.
Incluí rollback plan y respetá guardrails.
${outputContract}
`;
}

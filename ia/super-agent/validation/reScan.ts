import type { ProjectConfig, ScanArtifact } from "../types";
import { runScan } from "../scan-engine/capture";

/**
 * Trigger a re-scan after delivery for validation.
 */
export async function reScan(cfg: ProjectConfig): Promise<ScanArtifact> {
  return runScan(cfg);
}

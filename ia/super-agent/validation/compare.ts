import type { ScanArtifact, ValidationResult } from "../types";

/**
 * MVP validation: checks that a new scan exists and returns OK/PARTIAL.
 * Phase 2: compare DOM deltas, visual diffs, and real metrics deltas.
 */
export function compareBeforeAfter(before: ScanArtifact, after: ScanArtifact): ValidationResult {
  const notes: string[] = [];

  if (before.heuristics.hasClearPrimaryCta && !after.heuristics.hasClearPrimaryCta) {
    notes.push("Advertencia: antes había CTA claro y ahora no se detecta.");
  }

  const status: ValidationResult["status"] =
    notes.length ? "PARTIAL" : "OK";

  return {
    status,
    before: { scanId: before.scanId, screenshotUrl: before.screenshots.desktopFull, metrics: before.metrics },
    after: { scanId: after.scanId, screenshotUrl: after.screenshots.desktopFull, metrics: after.metrics },
    notes,
    learnedPattern: status === "OK" ? "Patrón: mejoras CRO con CTA primario visible tienden a mejorar CVR." : undefined,
  };
}

import type { ScanArtifact } from "../types";

/**
 * Como ../types no exporta ValidationResult en este momento,
 * definimos un MVP local consistente con lo que devuelve esta función.
 *
 * Si más adelante querés centralizarlo, exportalo desde ../types
 * y eliminá esta definición.
 */
export type ValidationResult = {
  status: "OK" | "PARTIAL" | "FAIL";
  before: { scanId?: string; screenshotUrl?: string };
  after: { scanId?: string; screenshotUrl?: string };
  notes: string[];
  learnedPattern?: string;
};

/**
 * MVP validation: checks that a new scan exists and returns OK/PARTIAL.
 * Phase 2: compare DOM deltas, visual diffs, and real metrics deltas.
 */
export function compareBeforeAfter(before: ScanArtifact, after: ScanArtifact): ValidationResult {
  const notes: string[] = [];

  // Validaciones mínimas de sanidad (porque ScanArtifact actual es “thin”)
  if (!(before as any)?.scanId) notes.push("Antes: falta scanId.");
  if (!(after as any)?.scanId) notes.push("Después: falta scanId.");

  // screenshots según el tipo actual: { desktop?: string; mobile?: string }
  const beforeDesktop = (before as any)?.screenshots?.desktop;
  const afterDesktop = (after as any)?.screenshots?.desktop;

  if (!beforeDesktop) notes.push("Antes: falta screenshots.desktop.");
  if (!afterDesktop) notes.push("Después: falta screenshots.desktop.");

  // Si en el futuro ScanArtifact vuelve a incluir heuristics/metrics,
  // acá podés reactivar comparaciones reales. Por ahora, no existen en el tipo.

  const status: ValidationResult["status"] = notes.length ? "PARTIAL" : "OK";

  return {
    status,
    before: { scanId: (before as any)?.scanId, screenshotUrl: beforeDesktop },
    after: { scanId: (after as any)?.scanId, screenshotUrl: afterDesktop },
    notes,
    learnedPattern:
      status === "OK"
        ? "Patrón: escaneos consistentes y completos permiten auditorías CRO más confiables."
        : undefined,
  };
}

import type { ProjectConfig, ScanArtifact, WeeklyPlan } from "../types";
import { committeeRun } from "../committee";

/**
 * Plan workflow (robusto):
 * - No depende de nombres viejos (runCommittee).
 * - Tolera ambas firmas posibles de committeeRun:
 *    1) committeeRun(cfg, scan)
 *    2) committeeRun({ cfg, scan })
 * - Devuelve un WeeklyPlan estable para el dashboard.
 */

function fallbackPlan(projectId: string): WeeklyPlan {
  return {
    projectId,
    weekOf: Date.now(),
    headline: "Plan semanal (fallback)",
    actions: [],
    notes: {
      system: "No se pudo generar plan real; devolviendo fallback.",
    },
  };
}

async function runCommitteeCompat(cfg: ProjectConfig, scan: ScanArtifact): Promise<any> {
  const fn: any = committeeRun;

  // Preferir (cfg, scan) si el fn declara 2 params
  try {
    if (typeof fn === "function" && fn.length >= 2) {
      return await fn(cfg, scan);
    }
  } catch {
    // fallback a la firma objeto
  }

  // Fallback: firma objeto
  return await fn({ cfg, scan });
}

export async function generatePlan(cfg: ProjectConfig, scan: ScanArtifact): Promise<WeeklyPlan> {
  const projectId = String((cfg as any).projectId ?? "demo-project");

  try {
    const committeeOut = await runCommitteeCompat(cfg, scan);

    // committeeOut puede ser:
    // - { plan, recommendations, notes }
    // - o directamente un plan
    const plan: WeeklyPlan | undefined = committeeOut?.plan ?? committeeOut;

    if (plan && typeof plan === "object" && "weekOf" in plan) {
      // Asegurar projectId por si no viene
      return { projectId, ...(plan as any) };
    }

    return fallbackPlan(projectId);
  } catch (err: any) {
    return {
      ...fallbackPlan(projectId),
      notes: {
        system: "Error generando plan; fallback.",
        error: String(err?.message ?? err),
      },
    };
  }
}

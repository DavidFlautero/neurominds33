import type { RollbackPlan } from "../types";

export function defaultRollbackPlan(): RollbackPlan {
  return {
    trigger: "Si los KPIs empeoran significativamente vs baseline",
    action: "Revertir cambios / pausar campañas / restaurar configuración anterior",
    observationWindow: "48h",
  };
}

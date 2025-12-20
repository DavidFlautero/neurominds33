import { SAAction } from "@/ia/super-agent/types/core";
import { rollbackForCategory } from "@/ia/super-agent/guardrails/rollback";

function id(prefix: string) {
  return prefix + "_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

export function recommendationsFromScan(scan: any): SAAction[] {
  const issues: any[] = scan?.issues || [];
  const out: SAAction[] = [];

  for (const it of issues.slice(0, 20)) {
    const title = it.title || it.type || "Mejora detectada";
    const cat = (it.category || "CRO") as SAAction["category"];

    out.push({
      id: id("scan"),
      title,
      category: cat,
      priority: (it.priority ?? 3) as any,
      effort: (it.effort ?? "S") as any,
      advantage: it.advantage || "Mejora rendimiento del embudo y claridad.",
      risk: { level: (it.riskLevel || "low"), notes: it.riskNotes || "Riesgo controlable con test." },
      expected: { metric: it.metric || "CVR", delta: it.delta || "+3% a +10%", timeframe: it.timeframe || "2–4 semanas" },
      requiresApproval: Boolean(it.requiresApproval),
      why: Array.isArray(it.why) ? it.why : [it.why || "Basado en heurística de UX/SEO/CRO."],
      how: Array.isArray(it.how) ? it.how : [it.how || "Aplicar cambio incremental y medir."],
      rollback: rollbackForCategory(cat),
    });
  }

  return out;
}

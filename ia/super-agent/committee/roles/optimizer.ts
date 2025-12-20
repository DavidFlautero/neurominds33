import { CommitteeInput, CommitteeOpinion, SAAction } from "@/ia/super-agent/types/core";
import { rollbackForCategory } from "@/ia/super-agent/guardrails/rollback";

function id(prefix: string) {
  return prefix + "_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

export function optimizerOpinion(input: CommitteeInput): CommitteeOpinion {
  const scan = input.scan || {};
  const ctx = input.context || {};
  const actions: SAAction[] = [];

  // If Ads readiness not OK, recommend sequencing.
  const apt = scan?.adsReadiness?.apt;

  actions.push({
    id: id("act"),
    title: "Secuencia tipo agencia: Fundamentos → Landing → Oferta → Ads (safe mode)",
    category: "ADS_READY",
    priority: 1,
    effort: "S",
    advantage: "Evita quemar presupuesto; construye base de conversión primero.",
    risk: { level: "low", notes: "Riesgo bajo; mejora consistencia." },
    expected: { metric: "CPA", delta: "Menos desperdicio 10–30%", timeframe: "2–4 semanas" },
    requiresApproval: false,
    why: ["Si la landing está floja, Ads solo amplifica el problema."],
    how: [
      "Semana 1: tracking + copy base",
      "Semana 2: UX + oferta",
      "Semana 3: tests",
      "Semana 4: Ads audit/import (sin ejecutar)"
    ],
    rollback: rollbackForCategory("ADS_READY"),
  });

  // Ads safe mode analysis approach (no execution)
  actions.push({
    id: id("act"),
    title: "Ads audit SAFE MODE: analizar campañas (sin ejecutar cambios) y proponer ajustes",
    category: "ADS_READY",
    priority: apt === true ? 2 : 3,
    effort: "M",
    advantage: "Detecta desperdicio en keywords/copy/estructura sin riesgo financiero.",
    risk: { level: "low", notes: "No ejecuta nada; solo reporta." },
    expected: { metric: "ROAS", delta: "+5% a +20% (si se aplica)", timeframe: "2–6 semanas" },
    requiresApproval: true,
    why: ["Primero se audita, luego se pide permiso y se ejecuta."],
    how: ["Import CSV/Export", "Analizar keyword intent", "Comparar con landing", "Proponer negativas/RSAs"],
    rollback: rollbackForCategory("ADS_READY"),
  });

  const redFlags: string[] = [];
  if (!ctx?.budget) redFlags.push("Budget not defined: need weekly/monthly caps for safe planning.");
  if (ctx?.experienceLevel === "none") redFlags.push("Client is new to Ads: require education + approvals by default.");

  return {
    role: "optimizer",
    score: { impact: 7, risk: 7, confidence: 6, effort: 6 },
    notes: ["Plan must be executable; keep actions limited and measurable."],
    suggestedActions: actions,
    redFlags,
  };
}

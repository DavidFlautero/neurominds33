import { CommitteeInput, CommitteeOpinion, SAAction } from "@/ia/super-agent/types/core";
import { rollbackForCategory } from "@/ia/super-agent/guardrails/rollback";

function id(prefix: string) {
  return prefix + "_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

export function analystOpinion(input: CommitteeInput): CommitteeOpinion {
  const scan = input.scan || {};
  const ctx = input.context || {};
  const issues: any[] = scan?.issues || [];

  const actions: SAAction[] = [];

  // Tracking / readiness
  const trackingBad = issues.some(i => /tracking|pixel|gtm|analytics/i.test(i.title || i.type || ""));
  if (trackingBad) {
    actions.push({
      id: id("act"),
      title: "Arreglar tracking (GA4 / eventos / conversiones) antes de escalar Ads",
      category: "TRACKING",
      priority: 1,
      effort: "M",
      advantage: "Evita gastar presupuesto sin atribución y permite optimizar por conversiones reales.",
      risk: { level: "low", notes: "Riesgo bajo; requiere validación en staging." },
      expected: { metric: "ROAS / CPA", delta: "Mejora indirecta 10–30%", timeframe: "1–2 semanas" },
      requiresApproval: false,
      why: ["Sin tracking, Ads optimiza mal.", "No se puede medir impacto real."],
      how: ["Verificar tags/GA4", "Configurar eventos clave", "Probar con debug view"],
      rollback: rollbackForCategory("TRACKING"),
    });
  }

  // Landing clarity
  const lowClarity = issues.some(i => /cta|copy|claridad|message|hero/i.test(i.title || ""));
  if (lowClarity) {
    actions.push({
      id: id("act"),
      title: "Mejorar propuesta de valor en el hero (H1 + subtítulo + CTA único)",
      category: "LANDING",
      priority: 1,
      effort: "S",
      advantage: "Reduce rebote y aumenta intención de compra/contacto.",
      risk: { level: "low", notes: "Riesgo bajo; se puede A/B testear." },
      expected: { metric: "CVR", delta: "+5% a +15%", timeframe: "7–14 días" },
      requiresApproval: false,
      why: ["El usuario decide en 3–5 segundos.", "CTA múltiple dispersa conversión."],
      how: ["Un H1 concreto", "3 bullets de beneficio", "CTA único arriba del fold"],
      rollback: rollbackForCategory("LANDING"),
    });
  }

  // Performance/SEO basics
  const seoBad = issues.some(i => /title|meta|h1|seo|index|canonical/i.test(i.title || i.type || ""));
  if (seoBad) {
    actions.push({
      id: id("act"),
      title: "SEO base: title/meta/H1 + estructura + enlazado interno",
      category: "SEO",
      priority: 2,
      effort: "M",
      advantage: "Mejora tráfico orgánico y Quality Score indirecto.",
      risk: { level: "low", notes: "Cuidado con duplicados y canónicos." },
      expected: { metric: "Organic clicks", delta: "+5% a +20%", timeframe: "3–8 semanas" },
      requiresApproval: false,
      why: ["SEO base es una ventaja acumulativa.", "Mejora relevancia y confianza."],
      how: ["Titles únicos", "H1 claro", "Schema básico", "Links a money pages"],
      rollback: rollbackForCategory("SEO"),
    });
  }

  // Budget constraint
  const maxWeeklySpendUsd = input.constraints?.maxWeeklySpendUsd ?? 100;
  const approvalOver = input.constraints?.requireApprovalOverUsd ?? 25;
  const mustApprove = maxWeeklySpendUsd >= approvalOver;

  const redFlags: string[] = [];
  if (!ctx?.objective) redFlags.push("Missing objective: define goal (ventas/leads/visitas).");
  if (!scan?.adsReadiness) redFlags.push("Missing scan.adsReadiness: cannot judge Ads safely.");

  return {
    role: "analyst",
    score: { impact: 7, risk: 7, confidence: 7, effort: 6 },
    notes: [
      `Budget weekly cap: USD ${maxWeeklySpendUsd}.`,
      mustApprove ? `Any spend changes should require approval over USD ${approvalOver}.` : "Approval threshold not set; default safety applies."
    ],
    suggestedActions: actions,
    redFlags,
  };
}

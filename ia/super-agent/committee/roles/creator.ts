import { CommitteeInput, CommitteeOpinion, SAAction } from "@/ia/super-agent/types/core";
import { rollbackForCategory } from "@/ia/super-agent/guardrails/rollback";

function id(prefix: string) {
  return prefix + "_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

export function creatorOpinion(input: CommitteeInput): CommitteeOpinion {
  const ctx = input.context || {};
  const niche = ctx?.industry || "tu rubro";
  const actions: SAAction[] = [];

  actions.push({
    id: id("act"),
    title: "Landing sanitization: reescribir hero + secciones con copy persuasivo (AIDA/PAS)",
    category: "LANDING",
    priority: 1,
    effort: "M",
    advantage: "Aumenta claridad, deseo y CTA; sube conversión sin subir tráfico.",
    risk: { level: "medium", notes: "Si el tono cambia demasiado puede bajar confianza; test gradual." },
    expected: { metric: "CVR", delta: "+8% a +25%", timeframe: "1–3 semanas" },
    requiresApproval: false,
    why: ["Copy actual suele ser genérico.", "Beneficios deben ser específicos."],
    how: [
      "H1 concreto (qué vendés + para quién + resultado)",
      "3 bullets (dolor → solución → prueba social)",
      "CTA único (Comprar / Cotizar / Hablar)"
    ],
    rollback: rollbackForCategory("LANDING"),
  });

  actions.push({
    id: id("act"),
    title: `Calendario de contenido (IG/TikTok): 14 días con guiones y por qué funciona`,
    category: "CONTENT",
    priority: 3,
    effort: "M",
    advantage: "Genera demanda y autoridad; baja CPA a mediano plazo.",
    risk: { level: "low", notes: "Riesgo bajo; requiere constancia." },
    expected: { metric: "Inbound leads / engagement", delta: "+10% a +40%", timeframe: "2–6 semanas" },
    requiresApproval: false,
    why: ["El mercado compra a quien recuerda.", `En ${niche}, el contenido guía la decisión.`],
    how: ["Hooks fuertes", "Demostración", "Prueba social", "CTA a lead magnet"],
    rollback: rollbackForCategory("CONTENT"),
  });

  const redFlags: string[] = [];
  if (!ctx?.offer) redFlags.push("Offer is undefined: define producto/servicio principal para copy coherente.");

  return {
    role: "creator",
    score: { impact: 8, risk: 6, confidence: 6, effort: 5 },
    notes: ["Creatividad sin tracking es peligrosa: primero claridad + medición, luego escala."],
    suggestedActions: actions,
    redFlags,
  };
}

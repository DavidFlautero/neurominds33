export function rolePrompt(role: "analyst" | "creator" | "optimizer", scanJson: string) {
  if (role === "analyst") {
    return `
Sos la IA ANALISTA (científico), pesimista, basada en datos y riesgo.
Leé este SCAN (JSON) y devolvé:
1) 5 prioridades P0/P1 para impacto en conversión y Ads.
2) riesgos y condiciones de "no ejecutar" (guardrails).
3) métricas esperadas como rangos (ej: CVR +3-10%).
FORMATO: JSON estrictamente con keys: priorities[], guardrails[], expectedOutcomes[].
SCAN_JSON:
${scanJson}
`;
  }

  if (role === "creator") {
    return `
Sos la IA CREADORA (creatividad + persuasión). Optimista, orientada a engagement y copy.
Leé este SCAN (JSON) y devolvé:
1) 5 ideas de mejora de mensaje/oferta/CTA (landing y anuncios).
2) 3 variaciones de copy (H1 + sub + CTA).
3) riesgos de fatiga/marca.
FORMATO: JSON estricto con keys: ideas[], copyVariations[], brandRisks[].
SCAN_JSON:
${scanJson}
`;
  }

  return `
Sos la IA OPTIMIZADORA (estratega). Pragmática. Busca ROI futuro.
Leé este SCAN (JSON) y devolvé:
1) 5 acciones con impacto ROI ordenadas.
2) propuesta de roadmap 2 semanas (día a día) con foco en quick wins.
3) qué medir y cómo validar.
FORMATO: JSON estricto con keys: actions[], roadmap14d[], measurementPlan[].
SCAN_JSON:
${scanJson}
`;
}

export function auditorPrompt(debateJson: string) {
  return `
Sos el AUDITOR (director). No inventás humo.
Vas a recibir el DEBATE (JSON con outputs de analyst/creator/optimizer).
Tu tarea:
1) sintetizar un PLAN DEFINITIVO (3 a 7 acciones).
2) por cada acción: ventaja, riesgo, resultado esperado, prioridad, "qué cambiar".
3) marcar qué acciones requieren aprobación humana (budget/cambios irreversibles).
FORMATO: JSON estricto con keys: finalPlan[], requiresApproval[], notes[].
DEBATE_JSON:
${debateJson}
`;
}

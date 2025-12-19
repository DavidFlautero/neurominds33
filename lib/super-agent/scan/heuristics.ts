import crypto from "crypto";
import type { ScanFinding, ScanResult, Priority } from "./types";

function id() {
  return crypto.randomBytes(8).toString("hex");
}

function prio(p: Priority) {
  return p;
}

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

export function buildFindings(input: {
  siteUrl: string;
  fetchedUrl?: string;
  httpStatus?: number;
  timingMs: number;
  meta: ScanResult["meta"];
}) {
  const f: ScanFinding[] = [];
  const warnings: string[] = [];

  // TECH
  if (!input.meta.viewport) {
    f.push({
      id: id(),
      type: "TECH",
      priority: prio("P0"),
      title: "Falta meta viewport (riesgo mobile)",
      advantage: "Mejora experiencia móvil y performance en Ads (mobile traffic).",
      risk: "Al corregir viewport, puede requerir ajustar CSS responsive.",
      expectedResult: "Mejor CVR mobile y menor bounce rate en tráfico pago.",
      action: "Agregar <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> en <head>.",
      evidence: ["No se detectó <meta name=\"viewport\">"],
    });
  }

  if ((input.meta.title?.length || 0) < 8) {
    f.push({
      id: id(),
      type: "SEO",
      priority: prio("P1"),
      title: "Title ausente o demasiado corto",
      advantage: "Mejor CTR orgánico y coherencia para campañas.",
      risk: "Si se cambia sin estrategia puede afectar posicionamiento.",
      expectedResult: "Mayor CTR (orgánico) y mejor alineación con intención.",
      action: "Definir Title único por página (50–60 caracteres) con keyword + propuesta de valor.",
      evidence: [`Title actual: "${input.meta.title || "(vacío)"}"`],
    });
  }

  if (!input.meta.description || input.meta.description.length < 40) {
    f.push({
      id: id(),
      type: "SEO",
      priority: prio("P1"),
      title: "Meta description ausente o débil",
      advantage: "Aumenta CTR orgánico y reduce confusión en el anuncio.",
      risk: "Cambios masivos sin control pueden bajar CTR temporalmente.",
      expectedResult: "CTR orgánico mayor y anuncios más consistentes.",
      action: "Escribir description (140–160 chars) orientada a beneficios + CTA suave.",
      evidence: [`Description: "${input.meta.description || "(vacío)"}"`],
    });
  }

  if (input.meta.h1Count === 0) {
    f.push({
      id: id(),
      type: "SEO",
      priority: prio("P0"),
      title: "No hay H1 detectable",
      advantage: "Mejora comprensión SEO y claridad del mensaje (above-the-fold).",
      risk: "Si hay H1 visual pero no semántico, requiere ajuste HTML.",
      expectedResult: "Mejor relevancia SEO y claridad inicial para tráfico pago.",
      action: "Agregar un H1 único con propuesta de valor y keyword principal.",
      evidence: ["h1Count = 0"],
    });
  } else if (input.meta.h1Count > 1) {
    f.push({
      id: id(),
      type: "SEO",
      priority: prio("P2"),
      title: "Múltiples H1 (posible ambigüedad semántica)",
      advantage: "Estructura más limpia para SEO y accesibilidad.",
      risk: "Cambios pueden afectar estilos si el theme depende de H1.",
      expectedResult: "Mejor claridad semántica y crawling.",
      action: "Mantener 1 H1 principal y convertir el resto en H2/H3.",
      evidence: [`h1Count = ${input.meta.h1Count}`],
    });
  }

  if (input.meta.images > 0 && input.meta.imagesMissingAlt / Math.max(1, input.meta.images) > 0.3) {
    f.push({
      id: id(),
      type: "SEO",
      priority: prio("P2"),
      title: "Muchas imágenes sin ALT",
      advantage: "Mejora SEO, accesibilidad y performance en Google Shopping/imagen.",
      risk: "Tarea operativa (cargar ALT correctos).",
      expectedResult: "Mejor accesibilidad y señales SEO.",
      action: "Agregar ALT descriptivo a imágenes clave (productos, hero, categorías).",
      evidence: [`images=${input.meta.images} missingAlt=${input.meta.imagesMissingAlt}`],
    });
  }

  // CRO / UX heurístico simple con señales indirectas:
  // (Sin screenshots aún. Esto se vuelve más fuerte en Scan v2 con Playwright.)
  if (input.meta.links < 5) {
    f.push({
      id: id(),
      type: "UX",
      priority: prio("P2"),
      title: "Pocas rutas internas detectables (posible navegación pobre)",
      advantage: "Navegación clara aumenta exploración y conversiones.",
      risk: "Puede ser SPA con links renderizados tarde.",
      expectedResult: "Mayor páginas por sesión, menor bounce.",
      action: "Asegurar navegación visible: categorías, destacados, políticas, contacto.",
      evidence: [`links detectados=${input.meta.links}`],
    });
    warnings.push("La página puede renderizar contenido dinámico (SPA). El scan v1 puede subestimar links.");
  }

  if (input.meta.scripts > 40) {
    f.push({
      id: id(),
      type: "TECH",
      priority: prio("P1"),
      title: "Exceso de scripts (posible impacto de performance)",
      advantage: "Mejor LCP/CLS reduce costos en Ads y sube conversión.",
      risk: "Remover scripts puede romper tracking o widgets.",
      expectedResult: "Mejor performance y menor CPC efectivo por mejor QS/UX.",
      action: "Auditar tags/trackers: eliminar duplicados, defer/async donde aplique.",
      evidence: [`scripts=${input.meta.scripts}`],
    });
  }

  // ADS readiness
  const reasons: string[] = [];
  let score = 100;

  if (input.httpStatus && input.httpStatus >= 400) {
    reasons.push(`HTTP ${input.httpStatus} al intentar cargar.`);
    score -= 60;
  }

  if (!input.meta.viewport) {
    reasons.push("No hay viewport: riesgo fuerte en tráfico móvil (Ads).");
    score -= 15;
  }
  if (!input.meta.title || input.meta.title.length < 8) {
    reasons.push("Title débil: señales SEO/claridad bajas.");
    score -= 8;
  }
  if (!input.meta.description || input.meta.description.length < 40) {
    reasons.push("Meta description débil: baja coherencia de mensaje.");
    score -= 6;
  }
  if (input.meta.hasRobotsNoindex) {
    reasons.push("Detectado noindex: problema crítico para SEO y landings.");
    score -= 40;
  }
  if (input.timingMs > 8000) {
    reasons.push("Tiempo de carga alto (heurístico).");
    score -= 10;
  }

  score = clamp(score);
  let verdict: "APTO" | "NO_APTO" | "RIESGO" = "APTO";
  if (score < 55) verdict = "NO_APTO";
  else if (score < 75) verdict = "RIESGO";

  // scoring general (simple y consistente)
  const seo = clamp(100 - (input.meta.hasRobotsNoindex ? 40 : 0) - (input.meta.h1Count === 0 ? 20 : 0) - (!input.meta.description ? 10 : 0));
  const tech = clamp(100 - (!input.meta.viewport ? 25 : 0) - (input.timingMs > 8000 ? 15 : 0) - (input.meta.scripts > 40 ? 10 : 0));
  const ux = clamp(100 - (input.meta.links < 5 ? 10 : 0) - (input.meta.imagesMissingAlt > 10 ? 5 : 0));
  const cro = clamp(100 - (input.meta.links < 5 ? 10 : 0));

  const overall = clamp(Math.round((seo * 0.35 + tech * 0.25 + ux * 0.2 + cro * 0.2)));

  return {
    findings: f.slice(0, 20), // limitar para MVP
    warnings,
    scores: { seo, tech, ux, cro, overall },
    adsReadiness: { verdict, reasons: reasons.length ? reasons : ["Señales básicas OK para iniciar tests controlados."], score },
  };
}

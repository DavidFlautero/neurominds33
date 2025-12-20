import * as cheerio from "cheerio";

export type ScanFinding = {
  key: string;
  title: string;
  advantage: string;
  risk: string;
  expectedResult: string;
  priority: "P0" | "P1" | "P2";
  effort: "S" | "M" | "L";
  category: "SEO" | "UX" | "CRO" | "ADS_READY" | "TECH";
};

export type ScanReport = {
  url: string;
  fetchedAt: number;
  adsReadiness: { status: "APTO" | "NO_APTO" | "LIMITADO"; reasons: string[] };
  summary: { score: number; notes: string[] };
  findings: ScanFinding[];
  meta: Record<string, any>;
};

function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }

export async function scanV1(url: string): Promise<ScanReport> {
  const res = await fetch(url, { redirect: "follow" });
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = ($("title").first().text() || "").trim();
  const desc = ($('meta[name="description"]').attr("content") || "").trim();
  const h1 = ($("h1").first().text() || "").trim();
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const canonical = $('link[rel="canonical"]').attr("href") || "";
  const hasHttps = url.startsWith("https://");

  const links = $("a").toArray().map((a) => ($(a).attr("href") || "").trim()).filter(Boolean);
  const hasPrivacy = links.some((l) => /privacy|privacidad|pol[ií]tica.*priv|policy/i.test(l));
  const hasTerms = links.some((l) => /terms|t[eé]rminos|condiciones/i.test(l));
  const hasContact = links.some((l) => /contacto|contact|soporte|support/i.test(l));

  const buttons = $("button, a[role='button'], a.btn, a.button").length;
  const forms = $("form").length;
  const inputs = $("input").length;

  const imgCount = $("img").length;
  const imgAltMissing = $("img").toArray().filter((img) => !($(img).attr("alt") || "").trim()).length;

  const scripts = $("script").toArray().map((s) => ($(s).html() || "") + " " + ($(s).attr("src") || "")).join(" ");
  const hasGtag = /gtag\(|googletagmanager|GTM-/i.test(scripts);
  const hasFbq = /fbq\(|connect\.facebook\.net/i.test(scripts);

  const findings: ScanFinding[] = [];

  // SEO
  if (title.length < 25 || title.length > 70) {
    findings.push({
      key: "seo_title_length",
      title: "Título SEO fuera de rango",
      advantage: "Un title optimizado mejora CTR orgánico y calidad de anuncio.",
      risk: "CTR bajo y peor posicionamiento/Quality Score.",
      expectedResult: "Mejora de CTR (orgánico/ads) y claridad del mensaje.",
      priority: "P1",
      effort: "S",
      category: "SEO",
    });
  }
  if (!desc || desc.length < 70) {
    findings.push({
      key: "seo_meta_description",
      title: "Meta description débil o ausente",
      advantage: "Mejor snippet en Google y coherencia de oferta.",
      risk: "Menor CTR y tráfico menos calificado.",
      expectedResult: "CTR orgánico más alto; mejor intención del click.",
      priority: "P1",
      effort: "S",
      category: "SEO",
    });
  }
  if (!h1) {
    findings.push({
      key: "seo_h1_missing",
      title: "Falta H1 claro",
      advantage: "Claridad de propuesta y SEO on-page.",
      risk: "Mensaje confuso; SEO peor.",
      expectedResult: "Más claridad y mejor indexación.",
      priority: "P1",
      effort: "S",
      category: "SEO",
    });
  }

  // UX / CRO
  if (!hasViewport) {
    findings.push({
      key: "ux_viewport",
      title: "Sin meta viewport (riesgo mobile)",
      advantage: "Evita layout roto en mobile; mejora conversión.",
      risk: "Rebote alto en mobile; CVR cae fuerte.",
      expectedResult: "Menor rebote; mejor experiencia mobile.",
      priority: "P0",
      effort: "S",
      category: "UX",
    });
  }
  if (buttons < 2) {
    findings.push({
      key: "cro_cta_low",
      title: "Pocos CTAs visibles",
      advantage: "Más puntos de acción -> más leads/conversiones.",
      risk: "Usuarios no saben qué hacer; fuga de intención.",
      expectedResult: "Mayor tasa de interacción y conversiones.",
      priority: "P0",
      effort: "M",
      category: "CRO",
    });
  }
  if (forms === 0 && inputs < 3) {
    findings.push({
      key: "cro_no_capture",
      title: "No hay captura clara de lead",
      advantage: "Captura demanda y reduce CAC con remarketing.",
      risk: "Pérdida de oportunidades; sin data para retarget.",
      expectedResult: "Más leads; base para seguimiento/CRM.",
      priority: "P0",
      effort: "M",
      category: "CRO",
    });
  }
  if (imgAltMissing > Math.max(3, imgCount * 0.3)) {
    findings.push({
      key: "seo_img_alt",
      title: "Muchas imágenes sin ALT",
      advantage: "SEO + accesibilidad + calidad percibida.",
      risk: "Menor relevancia y accesibilidad pobre.",
      expectedResult: "Mejora SEO y experiencia.",
      priority: "P2",
      effort: "M",
      category: "SEO",
    });
  }

  // Ads readiness
  const reasons: string[] = [];
  let status: "APTO" | "NO_APTO" | "LIMITADO" = "APTO";

  if (!hasHttps) { status = "NO_APTO"; reasons.push("El sitio no está en HTTPS."); }
  if (!hasPrivacy) { status = status === "NO_APTO" ? "NO_APTO" : "LIMITADO"; reasons.push("Falta link visible a Política de Privacidad."); }
  if (!hasContact) { status = status === "NO_APTO" ? "NO_APTO" : "LIMITADO"; reasons.push("Falta página/sección de contacto clara."); }
  if (!hasGtag && !hasFbq) { status = status === "NO_APTO" ? "NO_APTO" : "LIMITADO"; reasons.push("No detecto tags de medición (GA/GTM/Meta)."); }

  findings.push({
    key: "ads_readiness",
    title: `Ads readiness: ${status}`,
    advantage: "Evita quemar presupuesto; mejora aprobación y performance.",
    risk: "Si corrés Ads sin base, sube CPC y baja ROAS.",
    expectedResult: "Campañas más estables, mejor Quality Score y tracking.",
    priority: status === "NO_APTO" ? "P0" : "P1",
    effort: status === "NO_APTO" ? "M" : "S",
    category: "ADS_READY",
  });

  // Score simple
  let score = 100;
  for (const f of findings) {
    if (f.priority === "P0") score -= 12;
    if (f.priority === "P1") score -= 7;
    if (f.priority === "P2") score -= 3;
  }
  score = clamp(score, 35, 98);

  const notes = [
    `Title: ${title ? "OK" : "FALTA"}`,
    `H1: ${h1 ? "OK" : "FALTA"}`,
    `Viewport: ${hasViewport ? "OK" : "FALTA"}`,
    `Tracking: ${hasGtag || hasFbq ? "Detectado" : "No detectado"}`,
  ];

  return {
    url,
    fetchedAt: Date.now(),
    adsReadiness: { status, reasons },
    summary: { score, notes },
    findings: findings.slice(0, 20),
    meta: { title, desc, h1, canonical, hasViewport, imgCount, imgAltMissing },
  };
}

import { fetchDom } from "./domExtract";
import { buildFindings } from "./heuristics";
import type { ScanResult } from "./types";

export async function runScan(input: { siteUrl: string; projectId?: string }) : Promise<ScanResult> {
  const started = Date.now();
  const siteUrl = input.siteUrl;

  try {
    const dom = await fetchDom(siteUrl);
    const built = buildFindings({
      siteUrl,
      fetchedUrl: dom.fetchedUrl,
      httpStatus: dom.httpStatus,
      timingMs: dom.timingMs,
      meta: dom.meta,
    });

    return {
      ok: true,
      projectId: input.projectId,
      siteUrl,
      fetchedUrl: dom.fetchedUrl,
      httpStatus: dom.httpStatus,
      timingMs: dom.timingMs,
      meta: dom.meta,
      scores: built.scores,
      adsReadiness: built.adsReadiness,
      findings: built.findings,
      warnings: built.warnings,
      createdAt: Date.now(),
    };
  } catch (e: any) {
    const timingMs = Date.now() - started;
    return {
      ok: false,
      projectId: input.projectId,
      siteUrl,
      timingMs,
      meta: {
        h1Count: 0,
        viewport: false,
        hasRobotsNoindex: false,
        scripts: 0,
        links: 0,
        images: 0,
        imagesMissingAlt: 0,
      },
      scores: { seo: 0, cro: 0, ux: 0, tech: 0, overall: 0 },
      adsReadiness: { verdict: "NO_APTO", reasons: ["No se pudo escanear el sitio (timeout/red)."], score: 0 },
      findings: [{
        id: "scan_error",
        type: "TECH",
        priority: "P0",
        title: "Error de escaneo",
        advantage: "Permite detectar problemas de conectividad/seguridad antes de invertir en Ads.",
        risk: "Sin scan no se puede priorizar optimización.",
        expectedResult: "Al corregir acceso, el agente podrá generar hallazgos reales.",
        action: "Verificar que la URL sea pública, sin bloqueo (WAF), y responda HTTP 200.",
        evidence: [String(e?.message || e)],
      }],
      warnings: ["Error capturado: el sistema devolvió un reporte mínimo para no romper el flujo."],
      createdAt: Date.now(),
    };
  }
}

import { randomUUID } from "crypto";
import type { ProjectConfig, ScanArtifact, Recommendation } from "../types";
import { analystRole } from "./roles/analyst";
import { creatorRole } from "./roles/creator";
import { optimizerRole } from "./roles/optimizer";
import { consensusMerge } from "./consensus";
import { auditorFinalize } from "./auditor";

/**
 * MVP behavior:
 * - Roles return prompts (strings), not JSON.
 * - consensusMerge will find no JSON and return [].
 * - We fallback to deterministic recommendations so UI works end-to-end.
 *
 * Next step:
 * - Replace role functions to call actual LLM APIs and return JSON strings.
 */
export async function committeeRun(cfg: ProjectConfig, scan: ScanArtifact): Promise<Recommendation[]> {
  const [a, c, o] = await Promise.all([
    analystRole(cfg, scan),
    creatorRole(cfg, scan),
    optimizerRole(cfg, scan),
  ]);

  const merged = consensusMerge([a, c, o]);

  const fallback: Recommendation[] = merged.length
    ? merged.map((r) => ({ ...r, scanId: scan.scanId, id: r.id || randomUUID() }))
    : [
        {
          id: randomUUID(),
          scanId: scan.scanId,
          type: "CRO",
          title: "CTA primario visible en mobile (sticky) hacia PDP/checkout",
          description:
            "Agregar CTA sticky en mobile y reforzar jerarquía: 1 promesa + 1 CTA. Reduce fricción y mejora conversión.",
          where: { pageUrl: scan.url, sectionKey: "aboveFold" },
          evidence: { notes: scan.heuristics.warnings.length ? scan.heuristics.warnings : ["Quick win CRO basado en heurísticas."], screenshotUrl: scan.screenshots.mobileFull },
          expectedImpact: { kpi: "CVR", estimate: "+5% a +15%" },
          effort: "M",
          risk: "low",
          requiresApproval: false,
          rollback: { trigger: "Rebote mobile sube > +10% en 48h", action: "Desactivar componente sticky / revertir", observationWindow: "48h" },
          nextAction: "CREATE_TASK",
        },
        {
          id: randomUUID(),
          scanId: scan.scanId,
          type: "ADS",
          title: "Remarketing 7 días (PDP/Cart) con límites CAC y frecuencia",
          description:
            "Crear audiencias de visitantes de PDP/Cart y ejecutar secuencia de anuncios (problema→solución→oferta).",
          where: { pageUrl: scan.url },
          evidence: { notes: ["Captura abandonos de alto valor. Configurar frecuencia y CPA target."], screenshotUrl: scan.screenshots.desktopFull },
          expectedImpact: { kpi: "ROAS", estimate: "2.0x a 4.0x" },
          effort: "M",
          risk: "medium",
          requiresApproval: true,
          rollback: { trigger: "CPA > CAC máximo por 24h", action: "Pausar sets, bajar frecuencia, ajustar segmentación", observationWindow: "24h" },
          nextAction: "EXECUTE_ADS",
        },
        {
          id: randomUUID(),
          scanId: scan.scanId,
          type: "COMPETITOR",
          title: "War room competencia: precios/promos + alertas por variación",
          description:
            "Monitorear competidores (URLs del panel) y alertar cuando cambian precios/promos. Recomendar reacción en horas.",
          where: { pageUrl: scan.url },
          evidence: { notes: ["Configurar lista de competidores y umbrales (ej: variación > 10%)."], screenshotUrl: undefined },
          expectedImpact: { kpi: "Tiempo de reacción", estimate: "Horas (vs días)" },
          effort: "S",
          risk: "low",
          requiresApproval: false,
          rollback: { trigger: "Falsos positivos frecuentes", action: "Ajustar umbral y normalización de precios", observationWindow: "7 días" },
          nextAction: "CREATE_TASK",
        },
      ];

  return auditorFinalize(cfg, fallback);
}

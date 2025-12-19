import { analyst } from "./roles/analyst";
import { creator } from "./roles/creator";
import { optimizer } from "./roles/optimizer";
import { auditor } from "./auditor";
import { normalizeJson } from "./consensus";

export async function runCommittee(scan: any) {
  const scanJson = JSON.stringify(scan);

  const [a, c, o] = await Promise.all([
    analyst(scanJson),
    creator(scanJson),
    optimizer(scanJson),
  ]);

  const debate = {
    analyst: { ok: a.ok, error: a.error, raw: a.text, json: normalizeJson(a.text) },
    creator: { ok: c.ok, error: c.error, raw: c.text, json: normalizeJson(c.text) },
    optimizer: { ok: o.ok, error: o.error, raw: o.text, json: normalizeJson(o.text) },
  };

  const debateJson = JSON.stringify(debate);
  const aud = await auditor(debateJson);

  const final = {
    ok: aud.ok,
    error: aud.error,
    raw: aud.text,
    json: normalizeJson(aud.text),
    debate,
  };

  // Fallback si Gemini no devuelve JSON usable
  if (!final.json) {
    final.json = {
      finalPlan: [
        {
          priority: "P0",
          action: "Corregir issues críticos del Scan antes de Ads",
          advantage: "Evita quemar presupuesto en tráfico pago.",
          risk: "Si se ignora, CPA sube y CVR cae.",
          expectedResult: "Mejor CVR y performance en Ads.",
          change: "Aplicar hallazgos P0 del reporte Scan v1.",
        },
      ],
      requiresApproval: ["Cualquier cambio que implique gasto o edición de campañas Ads."],
      notes: ["El auditor no pudo parsear JSON del modelo; se devolvió plan mínimo."],
    };
  }

  return final;
}

import type { ProjectConfig, ScanArtifact } from "../types";

export function baseContext(cfg: ProjectConfig, scan: ScanArtifact) {
  return `
OBJETIVO PRIMARIO: ${cfg.goals.primary}
OBJETIVOS SECUNDARIOS: ${(cfg.goals.secondary || []).join(", ")}

SITIO: ${cfg.siteUrl}
COMPETIDORES: ${(cfg.competitors || []).map(c => `${c.name}: ${c.url}`).join(" | ")}

GUARDRAILS:
- Budget mensual USD: ${cfg.guardrails.monthlyBudgetUsd}
- Budget diario USD: ${cfg.guardrails.dailyBudgetUsd}
- CAC máximo USD: ${cfg.guardrails.maxCACUsd}
- Aprobación si gasto > USD: ${cfg.guardrails.requiresApprovalAboveUsd}

PREFERENCIAS:
- noPopups: ${cfg.preferences?.noPopups ?? false}
- noPricingChanges: ${cfg.preferences?.noPricingChanges ?? false}
- tone: ${cfg.preferences?.tone ?? "balanced"}

SCAN HEURÍSTICAS:
- CTA primario claro: ${scan.heuristics.hasClearPrimaryCta}
- CTA visible mobile: ${scan.heuristics.mobileCtaVisible}
- Hero value prop: ${scan.heuristics.heroHasValueProp}
- Warnings: ${(scan.heuristics.warnings || []).join(" | ")}

DOM:
- title: ${scan.dom.title ?? ""}
- h1: ${scan.dom.h1 ?? ""}
- sample CTAs: ${(scan.dom.ctas || []).slice(0, 12).map(c => c.text).join(" | ")}

EVIDENCIA VISUAL:
- desktop screenshot: ${scan.screenshots.desktopFull ?? ""}
- mobile screenshot: ${scan.screenshots.mobileFull ?? ""}
`;
}

export const outputContract = `
DEVOLVÉ EXACTAMENTE un JSON array de recomendaciones con este shape:
[
  {
    "type":"CRO|ADS|SEO|COMPETITOR|TECH",
    "title":"string",
    "description":"string",
    "where":{"pageUrl":"string","sectionKey":"string?"},
    "evidence":{"notes":["..."],"screenshotUrl":"string?"},
    "expectedImpact":{"kpi":"string","estimate":"string"},
    "effort":"S|M|L",
    "risk":"low|medium|high",
    "requiresApproval": true|false,
    "rollback":{"trigger":"string","action":"string","observationWindow":"string"},
    "nextAction":"CREATE_TASK|ADD_TO_QUOTE|EXECUTE_ADS"
  }
]
SIN TEXTO EXTRA.
`;

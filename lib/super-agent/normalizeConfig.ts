import type { ProjectConfig } from "@/ia/super-agent/types";

/**
 * Normaliza payloads legacy/mixed al shape actual ProjectConfig.
 * Úsalo en TODAS las rutas API que llamen al engine.
 */
export function normalizeProjectConfig(input: any): ProjectConfig {
  const projectId = String(input?.projectId ?? input?.id ?? "demo-project");
  const siteUrl = String(input?.siteUrl ?? input?.url ?? "");

  const integrationsIn = input?.integrations ?? {};

  const ga4In = integrationsIn?.ga4 ?? {};
  const scIn = integrationsIn?.searchConsole ?? integrationsIn?.search_console ?? {};
  const clarityIn = integrationsIn?.clarity ?? {};
  const adsIn = integrationsIn?.ads ?? {};

  // goals legacy -> context.goal
  const legacyGoal =
    input?.goals?.primary ??
    input?.goal ??
    input?.context?.goal ??
    undefined;

  const cfg: ProjectConfig = {
    projectId,
    siteUrl,

    name: input?.name ? String(input.name) : undefined,

    competitors: Array.isArray(input?.competitors)
      ? input.competitors
          .map((c: any) => ({
            name: String(c?.name ?? ""),
            url: String(c?.url ?? ""),
          }))
          .filter((c: any) => c.name && c.url)
      : undefined,

    guardrails: input?.guardrails
      ? {
          currency: input.guardrails.currency ?? "USD",

          maxDailySpendUSD:
            Number(input.guardrails.maxDailySpendUSD ?? input.guardrails.dailyBudgetUsd ?? 0) || undefined,
          maxMonthlySpendUSD:
            Number(input.guardrails.maxMonthlySpendUSD ?? input.guardrails.monthlyBudgetUsd ?? 0) || undefined,
          requireApprovalAboveUSD:
            Number(input.guardrails.requireApprovalAboveUSD ?? input.guardrails.requiresApprovalAboveUsd ?? 0) ||
            undefined,

          maxCACUsd: Number(input.guardrails.maxCACUsd ?? 0) || undefined,
          maxCPAUsd: Number(input.guardrails.maxCPAUsd ?? 0) || undefined,

          allowAutoApplySiteChanges: Boolean(input.guardrails.allowAutoApplySiteChanges ?? false),
          allowAutoApplyAdsChanges: Boolean(input.guardrails.allowAutoApplyAdsChanges ?? false),
        }
      : undefined,

    integrations: {
      ga4: ga4In
        ? {
            enabled: Boolean(ga4In.enabled ?? !!ga4In.propertyId),
            propertyId: ga4In.propertyId ? String(ga4In.propertyId) : undefined,
            credentialsJson: ga4In.credentialsJson ? String(ga4In.credentialsJson) : undefined,
          }
        : undefined,

      // FIX CLAVE: soportar legacy "siteUrl" y mapear a "site"
      searchConsole: scIn
        ? {
            enabled: Boolean(scIn.enabled ?? !!(scIn.site ?? scIn.siteUrl)),
            site: scIn.site ? String(scIn.site) : scIn.siteUrl ? String(scIn.siteUrl) : undefined,
            credentialsJson: scIn.credentialsJson ? String(scIn.credentialsJson) : undefined,
          }
        : undefined,

      clarity: clarityIn
        ? {
            enabled: Boolean(clarityIn.enabled ?? !!clarityIn.projectId),
            projectId: clarityIn.projectId ? String(clarityIn.projectId) : undefined,
            apiKey: clarityIn.apiKey ? String(clarityIn.apiKey) : undefined,
          }
        : undefined,

      ads: adsIn
        ? {
            google: adsIn.google
              ? {
                  enabled: Boolean(adsIn.google.enabled ?? !!adsIn.google.customerId),
                  customerId: adsIn.google.customerId ? String(adsIn.google.customerId) : undefined,
                }
              : undefined,
            meta: adsIn.meta
              ? {
                  enabled: Boolean(adsIn.meta.enabled ?? !!adsIn.meta.adAccountId),
                  adAccountId: adsIn.meta.adAccountId ? String(adsIn.meta.adAccountId) : undefined,
                }
              : undefined,
            tiktok: adsIn.tiktok
              ? {
                  enabled: Boolean(adsIn.tiktok.enabled ?? !!adsIn.tiktok.adAccountId),
                  adAccountId: adsIn.tiktok.adAccountId ? String(adsIn.tiktok.adAccountId) : undefined,
                }
              : undefined,
          }
        : undefined,
    },

    // Wizard/context (acepta legacy "goals")
    context: input?.context || legacyGoal
      ? {
          ...(input?.context ?? {}),
          goal: legacyGoal ?? input?.context?.goal,
        }
      : undefined,
  };

  return cfg;
}

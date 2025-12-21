import { NextResponse } from "next/server";
import type { ProjectConfig } from "@/ia/super-agent/types";
import { executeAds } from "@/ia/super-agent/ads";

/**
 * Ads route (safe typed)
 * - Accepts legacy payload shapes
 * - Normalizes to ProjectConfig before calling engine
 */
function normalizeProjectConfig(input: any): ProjectConfig {
  const projectId = String(input?.projectId ?? input?.id ?? "demo-project");
  const siteUrl = String(input?.siteUrl ?? input?.url ?? "");

  // Legacy / mixed shapes
  const integrationsIn = input?.integrations ?? {};

  const ga4In = integrationsIn?.ga4 ?? {};
  const scIn = integrationsIn?.searchConsole ?? integrationsIn?.search_console ?? {};
  const clarityIn = integrationsIn?.clarity ?? {};
  const adsIn = integrationsIn?.ads ?? {};

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

          // Accept both legacy and current keys
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

      // FIX: searchConsole expects "site", not "siteUrl"
      searchConsole: scIn
        ? {
            enabled: Boolean(scIn.enabled ?? !!(scIn.site ?? scIn.siteUrl)),
            site: scIn.site ? String(scIn.site) : scIn.siteUrl ? String(scIn.siteUrl) : undefined,
            credentialsJson: scIn.credentialsJson ? String(scIn.credentialsJson) : undefined,
          }
        : undefined,

      clarity: clarityIn
        ? {
            enabled: Boolean(clarityIn.enabled ?? !!(clarityIn.projectId && (clarityIn.apiKey || input?.CLARITY_API_KEY))),
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

    // Map wizard context if present (optional)
    context: input?.context
      ? {
          businessStage: input.context.businessStage,
          goal: input.context.goal,
          experienceLevel: input.context.experienceLevel,
          budget: input.context.budget,
          region: input.context.region,
        }
      : undefined,
  };

  return cfg;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  // Some callers send { cfg, plan }, others send { ...cfgFields, plan }
  const rawCfg = body?.cfg ?? body ?? {};
  const plan = body?.plan ?? body?.input ?? body?.adsPlan ?? {};

  const cfg = normalizeProjectConfig(rawCfg);

  const result = await executeAds(cfg, plan);
  return NextResponse.json({ ok: true, result });
}

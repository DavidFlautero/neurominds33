import type { ProjectConfig, ScanArtifact } from "../types";

export function buildCommitteePrompts(args: {
  cfg: ProjectConfig;
  scan: ScanArtifact;
  context?: Record<string, unknown>;
}) {
  const { cfg, scan, context } = args;

  // Avoid tight coupling to ProjectConfig shape (v1). Keep robust for incremental typing.
  const cfgAny = cfg as any;
  const goal = cfgAny?.context?.goal ?? cfgAny?.goal ?? "unknown";
  const budgetMonthly = cfgAny?.context?.budget?.monthly ?? cfgAny?.budgetMonthly ?? "?";
  const budgetCurrency = cfgAny?.context?.budget?.currency ?? cfgAny?.currency ?? "";

  return {
    cfg,
    scan,
    context: context ?? {},
    brief:
      `Project: ${cfgAny?.name ?? cfgAny?.projectId ?? cfgAny?.id ?? "unknown"}\n` +
      `Site: ${cfgAny?.siteUrl ?? cfgAny?.url ?? "unknown"}\n` +
      `Scan: seoScore=${(scan as any).seoScore ?? "?"}, uxScore=${(scan as any).uxScore ?? "?"}, adsReady=${(scan as any).adsReady ?? "?"}\n` +
      `Goal: ${goal}\n` +
      `Budget: ${budgetMonthly} ${budgetCurrency}\n`,
  };
}

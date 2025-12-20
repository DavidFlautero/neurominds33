import type { ProjectConfig, ScanArtifact } from "../types";

export function buildCommitteePrompts(args: {
  cfg: ProjectConfig;
  scan: ScanArtifact;
  context?: Record<string, unknown>;
}) {
  const { cfg, scan, context } = args;

  // v1: structured prompt object (not raw strings yet)
  return {
    cfg,
    scan,
    context: context ?? {},
    // A compact "brief" that roles can reference
    brief:
      `Project: ${cfg.name ?? cfg.projectId}\n` +
      `Site: ${cfg.siteUrl}\n` +
      `Scan: seoScore=${scan.seoScore ?? "?"}, uxScore=${scan.uxScore ?? "?"}, adsReady=${scan.adsReady ?? "?"}\n` +
      `Goal: ${cfg.context?.goal ?? "unknown"}\n` +
      `Budget: ${cfg.context?.budget?.monthly ?? "?"} ${cfg.context?.budget?.currency ?? ""}\n`,
  };
}

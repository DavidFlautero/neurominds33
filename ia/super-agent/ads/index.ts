import type { ProjectConfig } from "../types";
import { executeGoogleAdsPlan } from "./googleAds";
import { executeMetaAdsPlan } from "./metaAds";
import { executeTikTokAdsPlan } from "./tiktokAds";

export async function executeAds(cfg: ProjectConfig, plan: any) {
  // In MVP: call stubs. Later: based on cfg.integrations.ads presence.
  return {
    google: await executeGoogleAdsPlan(cfg, plan),
    meta: await executeMetaAdsPlan(cfg, plan),
    tiktok: await executeTikTokAdsPlan(cfg, plan),
  };
}

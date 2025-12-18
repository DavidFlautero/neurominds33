import type { ProjectConfig } from "../types";

/**
 * Stub: Google Ads API execution.
 * In prod: OAuth2, customerId, create campaign/adgroups/ads.
 */
export async function executeGoogleAdsPlan(_cfg: ProjectConfig, _plan: any) {
  return { ok: false, message: "Google Ads execution not implemented yet." };
}

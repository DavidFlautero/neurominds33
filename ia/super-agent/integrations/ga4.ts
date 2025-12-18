import type { ProjectConfig } from "../types";

/**
 * Stub: integrate GA4 (Data API) later.
 * Return metrics used by committee (CVR, revenue, add_to_cart, begin_checkout, etc.).
 */
export async function fetchGa4Metrics(_cfg: ProjectConfig): Promise<Record<string, any>> {
  return {};
}

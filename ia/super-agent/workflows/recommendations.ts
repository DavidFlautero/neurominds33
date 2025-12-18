import type { Recommendation } from "../types";

/**
 * In MVP, recommendations live in memory.
 * Later: persist in DB with Drizzle.
 */
export function normalizeRecommendations(recs: Recommendation[]) {
  return recs.map((r) => ({
    ...r,
    title: (r.title || "").trim(),
    description: (r.description || "").trim(),
  }));
}

import { randomUUID } from "crypto";
import type { Quote, Recommendation } from "../types";

/**
 * Simple quote builder. Later: pricing table by effort/type + DB persistence.
 */
export function buildQuote(projectId: string, recs: Recommendation[]): Quote {
  const id = randomUUID();
  const items = recs.map((r) => ({
    recommendationId: r.id,
    priceUsd: estimatePriceUsd(r),
    effort: r.effort,
  }));

  return {
    id,
    projectId,
    items,
    status: "DRAFT",
    createdAt: new Date().toISOString(),
  };
}

function estimatePriceUsd(r: Recommendation) {
  // MVP heuristic pricing
  const base = r.effort === "S" ? 80 : r.effort === "M" ? 150 : 300;
  const risk = r.risk === "high" ? 1.4 : r.risk === "medium" ? 1.2 : 1.0;
  const type = r.type === "ADS" ? 1.25 : 1.0;
  return Math.round(base * risk * type);
}

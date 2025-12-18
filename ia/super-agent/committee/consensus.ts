import { extractJson } from "../utils/safeJson";
import type { Recommendation } from "../types";

export function consensusMerge(roleOutputs: string[]): Recommendation[] {
  const recs: Recommendation[] = [];

  for (const out of roleOutputs) {
    const parsed = extractJson(out);
    if (Array.isArray(parsed)) {
      for (const r of parsed) recs.push(r as Recommendation);
    }
  }

  // Dedup by normalized title
  const uniq = new Map<string, Recommendation>();
  for (const r of recs) {
    const key = (r.title || "").toLowerCase().trim();
    if (!uniq.has(key)) uniq.set(key, r);
  }

  return Array.from(uniq.values());
}

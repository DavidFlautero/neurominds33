/**
 * DEV-ONLY in-memory store.
 * Replace with DB (Drizzle) when you finalize persistence.
 */
import type { Approval, Quote, Recommendation, ScanArtifact, Task } from "@/ia/super-agent/types";

export const store = {
  lastScanByProject: new Map<string, ScanArtifact>(),
  recommendationsByProject: new Map<string, Recommendation[]>(),
  approvalsByProject: new Map<string, Approval[]>(),
  quotesByProject: new Map<string, Quote[]>(),
  tasksByProject: new Map<string, Task[]>(),
  competitorsByProject: new Map<string, { name: string; url: string }[]>(),
};

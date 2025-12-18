import { randomUUID } from "crypto";
import type { Approval, Recommendation } from "../types";

export function requestApproval(projectId: string, r: Recommendation): Approval {
  return {
    id: randomUUID(),
    projectId,
    scope: r.type === "ADS" ? "ADS" : r.type === "SEO" ? "SEO" : r.type === "TECH" ? "TECH" : "CRO",
    title: r.title,
    description: r.description,
    requestedAt: new Date().toISOString(),
    status: "PENDING",
    rollback: r.rollback,
  };
}

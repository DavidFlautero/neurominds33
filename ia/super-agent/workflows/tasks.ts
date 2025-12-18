import { randomUUID } from "crypto";
import type { Task, Recommendation } from "../types";

export function createTask(projectId: string, r: Recommendation): Task {
  return {
    id: randomUUID(),
    projectId,
    recommendationId: r.id,
    state: "DETECTED",
    createdAt: new Date().toISOString(),
  };
}

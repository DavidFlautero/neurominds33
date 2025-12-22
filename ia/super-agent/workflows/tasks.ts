import type { Recommendation, Task } from "../types";

function makeId(prefix = "task"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

/**
 * Build "Tasks" from Recommendations.
 * - Tipos estables: createdAt es number (epoch ms)
 * - status usa los valores del type TaskStatus en types/index.ts
 */
export function buildTasks(projectId: string, recommendations: Recommendation[]): Task[] {
  const now = Date.now();

  return (recommendations || []).map((r) => {
    const task: Task = {
      id: makeId("task"),
      projectId: String(projectId),
      recommendationId: r.id,

      title: r.title || "Tarea",
      description: r.action || r.detail || "",

      // estado inicial coherente con TaskStatus
      status: "pending",

      createdAt: now,
    };

    return task;
  });
}


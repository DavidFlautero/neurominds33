export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { TaskDeliverSchema } from "../_schemas";
import { store } from "../_store";
import { reScan } from "@/ia/super-agent/validation/reScan";
import { compareBeforeAfter } from "@/ia/super-agent/validation/compare";

export async function POST(req: Request) {
  const body = await req.json();
  const { projectId, taskId, cfg } = TaskDeliverSchema.parse(body);

  const tasks = store.tasksByProject.get(projectId) ?? [];
  const taskIdx = tasks.findIndex(t => t.id === taskId);
  if (taskIdx === -1) return NextResponse.json({ error: "Task not found." }, { status: 404 });

  const before = store.lastScanByProject.get(projectId);
  if (!before) return NextResponse.json({ error: "No baseline scan found." }, { status: 400 });

  // re-scan
  const after = await reScan(cfg);

  // compare
  const validation = compareBeforeAfter(before, after);

  // update store
  store.lastScanByProject.set(projectId, after);
  tasks[taskIdx] = {
    ...tasks[taskIdx],
    state:
      validation.status === "OK"
        ? "VALIDATED_OK"
        : validation.status === "PARTIAL"
        ? "VALIDATED_PARTIAL"
        : "VALIDATED_FAILED",
    deliveredAt: new Date().toISOString(),
    validation,
  };
  store.tasksByProject.set(projectId, tasks);

  return NextResponse.json({ task: tasks[taskIdx], before, after, validation });
}

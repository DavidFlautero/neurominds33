import { NextResponse } from "next/server";
import { ProjectConfigSchema } from "../_schemas";
import { runFullSuperAgentScan } from "@/ia/super-agent";
import { store } from "../_store";
import { requestApproval } from "@/ia/super-agent/workflows/approvals";
import { createTask } from "@/ia/super-agent/workflows/tasks";

export async function POST(req: Request) {
  const body = await req.json();
  const cfg = ProjectConfigSchema.parse(body);

  // persist competitors list (dev store)
  store.competitorsByProject.set(cfg.projectId, cfg.competitors);

  const result = await runFullSuperAgentScan(cfg);

  store.lastScanByProject.set(cfg.projectId, result.scan);
  store.recommendationsByProject.set(cfg.projectId, result.recommendations);

  // Auto-create approvals & tasks skeletons (MVP)
  const approvals = store.approvalsByProject.get(cfg.projectId) ?? [];
  const tasks = store.tasksByProject.get(cfg.projectId) ?? [];

  for (const r of result.recommendations) {
    if (r.requiresApproval) approvals.push(requestApproval(cfg.projectId, r));
    // Always create a task draft (you can refine: only for CREATE_TASK / ADD_TO_QUOTE)
    tasks.push(createTask(cfg.projectId, r));
  }

  store.approvalsByProject.set(cfg.projectId, approvals);
  store.tasksByProject.set(cfg.projectId, tasks);

  return NextResponse.json(result);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") || "local";
  const scan = store.lastScanByProject.get(projectId) ?? null;
  const recommendations = store.recommendationsByProject.get(projectId) ?? [];
  return NextResponse.json({ scan, recommendations });
}

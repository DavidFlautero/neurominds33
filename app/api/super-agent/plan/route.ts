import { NextResponse } from "next/server";
import { getContext, getPlan, getProject, getScan, setPlan, upsertProject, logEvent } from "@/lib/super-agent/store";
import { generatePlan } from "@/ia/super-agent/workflows/plan";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") || "";
  if (!projectId) return NextResponse.json({ ok: false, error: "missing projectId" }, { status: 400 });

  const plan = getPlan(projectId);
  return NextResponse.json({ ok: true, plan });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.projectId) return NextResponse.json({ ok: false, error: "missing projectId" }, { status: 400 });

  // ensure project exists in store (even if DB not used)
  upsertProject({ id: body.projectId, name: body.projectName, siteUrl: body.siteUrl });

  const project = getProject(body.projectId);
  const context = getContext(body.projectId);
  const scan = getScan(body.projectId);

  const plan = generatePlan({
    projectId: body.projectId,
    project: { name: project?.name, siteUrl: project?.siteUrl },
    context,
    scan,
    constraints: {
      country: context?.country || "AR",
      maxWeeklySpendUsd: context?.budget?.weeklyUsd ?? 100,
      maxMonthlySpendUsd: context?.budget?.monthlyUsd ?? 400,
      requireApprovalOverUsd: context?.budget?.approvalOverUsd ?? 25,
      objective: context?.objective ?? undefined,
      experienceLevel: context?.experienceLevel ?? "none",
    },
  });

  setPlan(body.projectId, plan);
  logEvent(body.projectId, { type: "plan_generated", score: plan.summary.score });

  return NextResponse.json({ ok: true, plan });
}

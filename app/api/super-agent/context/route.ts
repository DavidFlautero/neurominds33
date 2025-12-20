import { NextResponse } from "next/server";
import { getContext, getProject, setContext, upsertProject, logEvent } from "@/lib/super-agent/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") || "";
  if (!projectId) return NextResponse.json({ ok: false, error: "missing projectId" }, { status: 400 });

  const project = getProject(projectId);
  const context = getContext(projectId);

  return NextResponse.json({ ok: true, project, context });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.projectId) return NextResponse.json({ ok: false, error: "missing projectId" }, { status: 400 });

  upsertProject({ id: body.projectId, name: body.projectName, siteUrl: body.siteUrl });

  setContext(body.projectId, {
    projectName: body.projectName || null,
    siteUrl: body.siteUrl || null,
    objective: body.objective || null,
    experienceLevel: body.experienceLevel || "none",
    country: body.country || "AR",
    budget: {
      weeklyUsd: Number(body?.budget?.weeklyUsd ?? 0) || 0,
      monthlyUsd: Number(body?.budget?.monthlyUsd ?? 0) || 0,
      approvalOverUsd: Number(body?.budget?.approvalOverUsd ?? 25) || 25,
    },
    offer: body.offer || null,
    industry: body.industry || null,
    competitors: Array.isArray(body.competitors) ? body.competitors.slice(0, 5) : [],
    createdAt: Date.now(),
  });

  logEvent(body.projectId, { type: "context_saved" });

  return NextResponse.json({ ok: true });
}

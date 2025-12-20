import { NextResponse } from "next/server";
import { getContext, getPlan, getProject, getScan, getLogs } from "@/lib/super-agent/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") || "";
  if (!projectId) return NextResponse.json({ ok: false, error: "missing projectId" }, { status: 400 });

  const project = getProject(projectId);
  const context = getContext(projectId);
  const scan = getScan(projectId);
  const plan = getPlan(projectId);
  const logs = getLogs(projectId);

  // readiness
  const readiness = {
    hasProject: Boolean(project),
    hasContext: Boolean(context),
    hasScan: Boolean(scan),
    hasPlan: Boolean(plan),
  };

  return NextResponse.json({
    ok: true,
    project,
    readiness,
    snapshot: {
      objective: context?.objective || null,
      score: plan?.summary?.score ?? null,
      adsReadiness: plan?.summary?.adsReadiness ?? scan?.adsReadiness ?? null,
      headline: plan?.summary?.headline ?? null,
    },
    logs: logs.slice(0, 50),
  });
}

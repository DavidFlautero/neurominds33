import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ ok: false, error: "missing_projectId" }, { status: 400 });

  const project = await prisma.nmProject.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ ok: false, error: "project_not_found" }, { status: 404 });

  return NextResponse.json({
    ok: true,
    project,
    readiness: {
      canScan: true,
      canPlan: project.status === "synced",
      reason: project.status === "synced" ? undefined : "sync_required",
    },
  });
}

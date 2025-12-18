import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

  const project = await prisma.nmProject.findUnique({
    where: { id: projectId },
    include: { context: true },
  });

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const eventsCount = await prisma.nmSyncEvent.count({ where: { projectId } });

  // KPIs mock por ahora (hasta Ads/GA4)
  const kpis = {
    spend: null,
    roas: null,
    cvr: null,
    aov: null,
  };

  const checklist = {
    synced: project.status === "synced" || project.status === "context_ready",
    contextReady: project.status === "context_ready",
    integrationsReady: false,
  };

  return NextResponse.json({
    project: {
      id: project.id,
      siteUrl: project.siteUrl,
      status: project.status,
      lastEventAt: project.lastEventAt,
      updatedAt: project.updatedAt,
    },
    eventsCount,
    checklist,
    kpis,
  });
}

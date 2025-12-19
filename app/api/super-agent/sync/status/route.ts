export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma");

    const { searchParams } = new URL(req.url);
    const projectId = String(searchParams.get("projectId") || "").trim();
    if (!projectId) {
      return NextResponse.json({ error: "projectId required" }, { status: 400 });
    }

    const project = await prisma.nmProject.findUnique({
      where: { id: projectId },
      select: { status: true, lastEventAt: true, siteUrl: true },
    });

    if (!project) {
      return NextResponse.json({ status: "created", lastEventAt: null }, { status: 200 });
    }

    return NextResponse.json({
      status: project.status || "created",
      lastEventAt: project.lastEventAt ? new Date(project.lastEventAt).getTime() : null,
      siteUrl: project.siteUrl || null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 });
  }
}

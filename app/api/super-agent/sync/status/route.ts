import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = String(searchParams.get("projectId") || "").trim();
    if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

    const project = await prisma.nmProject.findUnique({
      where: { id: projectId },
      select: { status: true, lastEventAt: true, siteUrl: true },
    });

    if (!project) return NextResponse.json({ status: "created", lastEventAt: null }, { status: 200 });

    return NextResponse.json({
      status: project.status || "created",
      lastEventAt: project.lastEventAt ? new Date(project.lastEventAt).getTime() : null,
      siteUrl: project.siteUrl || null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 });
  }
}

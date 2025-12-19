import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = String(searchParams.get("projectId") || "").trim();
  if (!projectId) return NextResponse.json({ ok: false, error: "missing_projectId" }, { status: 400 });

  const p = await prisma.nmProject.findUnique({
    where: { id: projectId },
    select: { id: true, siteUrl: true, status: true, lastEventAt: true },
  });
  if (!p) return NextResponse.json({ ok: false, error: "project_not_found" }, { status: 404 });

  return NextResponse.json({
    ok: true,
    context: {
      projectId: p.id,
      siteUrl: p.siteUrl,
      status: p.status,
      lastEventAt: p.lastEventAt ? p.lastEventAt.getTime() : null,
    },
  });
}

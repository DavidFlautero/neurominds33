export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { normalizeUrl } from "@/lib/super-agent/url";

export async function GET() {
  
  const { prisma } = await import("@/lib/prisma");
const projects = await prisma.nmProject.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, siteUrl: true, status: true, lastEventAt: true, createdAt: true, updatedAt: true },
  });
  return NextResponse.json({ ok: true, projects });
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = String(body?.id || "").trim();
  const siteUrl = normalizeUrl(String(body?.siteUrl || ""));

  if (!id || id.length < 3) return NextResponse.json({ ok: false, error: "invalid_project_id" }, { status: 400 });
  if (!siteUrl) return NextResponse.json({ ok: false, error: "invalid_site_url" }, { status: 400 });

  const exists = await prisma.nmProject.findUnique({ where: { id } });
  if (exists) return NextResponse.json({ ok: false, error: "project_already_exists" }, { status: 409 });

  const project = await prisma.nmProject.create({
    data: { id, siteUrl, status: "created" },
  });
  return NextResponse.json({ ok: true, project });
}

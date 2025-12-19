export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { normalizeUrl } from "@/lib/super-agent/url";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");

    const projects = await prisma.nmProject.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        siteUrl: true,
        status: true,
        lastEventAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, projects });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "projects_get_failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma");

    const body = await req.json();
    const id = String(body?.id || "").trim();
    const siteUrl = normalizeUrl(String(body?.siteUrl || ""));

    if (!id || id.length < 3) {
      return NextResponse.json({ ok: false, error: "invalid_project_id" }, { status: 400 });
    }
    if (!siteUrl) {
      return NextResponse.json({ ok: false, error: "invalid_site_url" }, { status: 400 });
    }

    const exists = await prisma.nmProject.findUnique({ where: { id } });
    if (exists) {
      return NextResponse.json({ ok: false, error: "project_already_exists" }, { status: 409 });
    }

    const project = await prisma.nmProject.create({
      data: { id, siteUrl, status: "created" },
    });

    return NextResponse.json({ ok: true, project });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "projects_post_failed" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function cleanUrl(u: string) {
  let url = (u || "").trim();
  if (!url) return "";
  // agrega https:// si el usuario puso dominio pelado
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  // normaliza trailing slash
  url = url.replace(/\/+$/, "");
  return url;
}

export async function GET() {
  try {
    const projects = await prisma.nmProject.findMany({
      orderBy: { updatedAt: "desc" },
      select: { id: true, siteUrl: true, status: true, lastEventAt: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ ok: true, projects });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body?.name || "").trim();
    const siteUrlRaw = String(body?.siteUrl || "").trim();
    const siteUrl = cleanUrl(siteUrlRaw);

    if (!name) return NextResponse.json({ ok: false, error: "name required" }, { status: 400 });
    if (!siteUrl) return NextResponse.json({ ok: false, error: "siteUrl required" }, { status: 400 });

    // si ya existe uno con mismo siteUrl, lo devolvemos (evita duplicados)
    const existing = await prisma.nmProject.findFirst({
      where: { siteUrl },
      select: { id: true, siteUrl: true, status: true, lastEventAt: true },
    });
    if (existing) return NextResponse.json({ ok: true, project: existing, reused: true });

    const id = (globalThis.crypto && "randomUUID" in globalThis.crypto)
      ? globalThis.crypto.randomUUID()
      : `nm_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;

    const project = await prisma.nmProject.create({
      data: {
        id,
        siteUrl,
        status: "created",
      },
      select: { id: true, siteUrl: true, status: true, lastEventAt: true },
    });

    return NextResponse.json({ ok: true, project });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "failed" }, { status: 500 });
  }
}

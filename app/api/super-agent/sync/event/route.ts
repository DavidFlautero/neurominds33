export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { getProject, updateStatus } from "@/ia/super-agent/state/projectState";

export const runtime = "nodejs";

function corsHeaders(origin?: string | null) {
  // En MVP: permitimos cualquier origen.
  // En producción: deberías validar contra project.siteUrl o una allowlist.
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  const body = await req.json().catch(() => null);
  const projectId = body?.projectId as string | undefined;

  if (!projectId) {
    return NextResponse.json(
      { ok: false, error: "missing projectId" },
      { status: 400, headers: corsHeaders(origin) }
    );
  }

  const project = getProject(projectId);
  if (!project) {
    return NextResponse.json(
      { ok: false, error: "project not found" },
      { status: 404, headers: corsHeaders(origin) }
    );
  }

  updateStatus(projectId, "synced");
  project.lastEventAt = Date.now();

  return NextResponse.json({ ok: true }, { headers: corsHeaders(origin) });
}

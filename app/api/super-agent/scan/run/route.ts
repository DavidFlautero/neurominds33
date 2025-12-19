import { NextResponse } from "next/server";
import { runScan } from "@/lib/super-agent/scan/scanRunner";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const siteUrl = String(body.siteUrl || "");
    const projectId = body.projectId ? String(body.projectId) : undefined;

    if (!siteUrl || !/^https?:\/\//i.test(siteUrl)) {
      return NextResponse.json({ ok: false, error: "siteUrl inválida. Debe comenzar con http(s)://" }, { status: 400 });
    }

    const result = await runScan({ siteUrl, projectId });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}

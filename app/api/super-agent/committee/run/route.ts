import { NextResponse } from "next/server";
import { runCommittee } from "@/lib/super-agent/committee";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const scan = body.scan;

    if (!scan || typeof scan !== "object") {
      return NextResponse.json({ ok: false, error: "Falta body.scan (ScanResult JSON)" }, { status: 400 });
    }

    const out = await runCommittee(scan);
    return NextResponse.json(out);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}

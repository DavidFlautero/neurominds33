import { NextResponse } from "next/server";
import { normalizeProjectConfig } from "@/lib/super-agent/normalizeConfig";
import { executeAds } from "@/ia/super-agent/ads";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const rawCfg = body?.cfg ?? body ?? {};
  const plan = body?.plan ?? body?.input ?? body?.adsPlan ?? {};

  const cfg = normalizeProjectConfig(rawCfg);

  const result = await executeAds(cfg, plan);
  return NextResponse.json({ ok: true, result });
}

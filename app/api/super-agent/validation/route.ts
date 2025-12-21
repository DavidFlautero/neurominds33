import { NextResponse } from "next/server";
import { normalizeProjectConfig } from "@/lib/super-agent/normalizeConfig";
import { reScan } from "@/ia/super-agent/validation/reScan";
import { compareBeforeAfter } from "@/ia/super-agent/validation/compare";

/**
 * Validation route
 * Body accepts:
 * - { cfg, before }  OR
 * - { projectId, siteUrl, integrations..., before }
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const rawCfg = body?.cfg ?? body ?? {};
  const before = body?.before ?? body?.baseline ?? body?.scanBefore ?? null;

  const cfg = normalizeProjectConfig(rawCfg);

  // Re-scan (after)
  const after = await reScan(cfg);

  // Compare
  const validation = compareBeforeAfter(before, after);

  return NextResponse.json({
    ok: true,
    projectId: cfg.projectId,
    validation,
    after,
  });
}

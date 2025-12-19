import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Stub estable: en fase DB, acá leemos job status real.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId") || null;

  return NextResponse.json({
    ok: true,
    projectId,
    state: "idle",
    message: "Scan v1 corre on-demand vía POST /api/super-agent/scan/run",
  });
}

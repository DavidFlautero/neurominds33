import { NextResponse } from "next/server";
import { getProjectLearning } from "@/lib/super-agent/learning/engine";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId") || "";
  if (!projectId) return NextResponse.json({ ok: false, error: "projectId required" }, { status: 400 });

  const data = await getProjectLearning(projectId);
  return NextResponse.json({ ok: true, projectId, ...data });
}

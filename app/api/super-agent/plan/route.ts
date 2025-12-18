import { NextResponse } from "next/server";
import { ProjectConfigSchema } from "../_schemas";
import { buildWeeklyPlan } from "@/ia/super-agent";
import { store } from "../_store";

export async function POST(req: Request) {
  const body = await req.json();
  const cfg = ProjectConfigSchema.parse(body);

  const scan = store.lastScanByProject.get(cfg.projectId);
  if (!scan) {
    return NextResponse.json(
      { error: "No scan found for this project. Run /api/super-agent/scan first." },
      { status: 400 }
    );
  }

  const plan = await buildWeeklyPlan(cfg, scan);
  return NextResponse.json(plan);
}

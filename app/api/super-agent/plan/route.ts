import { NextResponse } from "next/server";
import type { ProjectConfig, ScanArtifact } from "@/ia/super-agent/types";
import { generatePlan } from "@/ia/super-agent/workflows/plan";
import { prisma } from "@/lib/prisma";

import { getScan } from "../_store"; // ajusta si tu store está en otro path

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const projectId = String(body?.projectId ?? "");
  if (!projectId) return NextResponse.json({ ok: false, error: "projectId required" }, { status: 400 });

  const project = await prisma.nmProject.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ ok: false, error: "project not found" }, { status: 404 });

  const scan = getScan(projectId) as ScanArtifact | null;
  if (!scan) return NextResponse.json({ ok: false, error: "no scan available yet" }, { status: 400 });

  // Build ProjectConfig from DB + wizard payload (if any)
  const cfg: ProjectConfig = {
    projectId,
    siteUrl: project.siteUrl,
    name: (project as any).name ?? undefined,
    context: body?.context ?? undefined,
    competitors: body?.competitors ?? undefined,
    guardrails: body?.guardrails ?? undefined,
    integrations: body?.integrations ?? undefined,
  };

  const plan = await generatePlan(cfg, scan);
  return NextResponse.json({ ok: true, plan });
}

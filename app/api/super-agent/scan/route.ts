import { NextResponse } from "next/server";
import { z } from "zod";
import { scanV1 } from "@/lib/super-agent/scan/scanV1";
import { recordProposal } from "@/lib/super-agent/learning/engine";

export const dynamic = "force-dynamic";

const Schema = z.object({
  projectId: z.string().min(2),
  url: z.string().url(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const report = await scanV1(parsed.data.url);

  // Convertimos findings -> recommendations para el learning
  const proposalId = `scan_${Date.now()}`;
  await recordProposal({
    type: "proposal",
    projectId: parsed.data.projectId,
    proposalId,
    createdAt: Date.now(),
    source: "scan_v1",
    confidence: 0.72,
    recommendations: report.findings.map((f) => ({
      key: f.key,
      title: f.title,
      advantage: f.advantage,
      risk: f.risk,
      expectedResult: f.expectedResult,
      priority: f.priority,
      effort: f.effort,
    })),
  });

  return NextResponse.json({ ok: true, proposalId, report });
}

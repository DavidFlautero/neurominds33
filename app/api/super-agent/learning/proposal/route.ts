import { NextResponse } from "next/server";
import { z } from "zod";
import { recordProposal } from "@/lib/super-agent/learning/engine";

export const dynamic = "force-dynamic";

const Schema = z.object({
  projectId: z.string().min(2),
  proposalId: z.string().min(2),
  source: z.enum(["scan_v1", "ads_audit", "manual"]),
  recommendations: z.array(z.object({
    key: z.string().min(2),
    title: z.string().min(2),
    advantage: z.string().min(2),
    risk: z.string().min(2),
    expectedResult: z.string().min(2),
    priority: z.enum(["P0","P1","P2"]),
    effort: z.enum(["S","M","L"]),
  })).min(1),
  confidence: z.number().min(0).max(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const ev = await recordProposal({
    type: "proposal",
    createdAt: Date.now(),
    ...parsed.data,
  });
  return NextResponse.json({ ok: true, event: ev });
}

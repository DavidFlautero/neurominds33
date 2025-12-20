import { NextResponse } from "next/server";
import { z } from "zod";
import { recordDecision } from "@/lib/super-agent/learning/engine";

export const dynamic = "force-dynamic";

const Schema = z.object({
  projectId: z.string().min(2),
  proposalId: z.string().min(2),
  actor: z.enum(["client","internal"]),
  action: z.enum(["approved","rejected","modified"]),
  notes: z.string().optional(),
  modifications: z.array(z.object({ key: z.string(), change: z.string() })).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const ev = await recordDecision({
    type: "decision",
    decidedAt: Date.now(),
    ...parsed.data,
  });
  return NextResponse.json({ ok: true, event: ev });
}

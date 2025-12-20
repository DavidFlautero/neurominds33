import { NextResponse } from "next/server";
import { z } from "zod";
import { recordOutcome } from "@/lib/super-agent/learning/engine";

export const dynamic = "force-dynamic";

const Schema = z.object({
  projectId: z.string().min(2),
  proposalId: z.string().min(2),
  baseline: z.record(z.union([z.number(), z.string()])),
  after: z.record(z.union([z.number(), z.string()])),
});

function computeDelta(baseline: Record<string, any>, after: Record<string, any>) {
  const delta: Record<string, number> = {};
  for (const k of Object.keys(after)) {
    const b = baseline[k];
    const a = after[k];
    if (typeof b === "number" && typeof a === "number") {
      delta[k] = a - b;
    }
  }
  return delta;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const delta = computeDelta(parsed.data.baseline, parsed.data.after);
  const res = await recordOutcome({
    type: "outcome",
    measuredAt: Date.now(),
    ...parsed.data,
    delta,
  });
  return NextResponse.json({ ok: true, ...res });
}

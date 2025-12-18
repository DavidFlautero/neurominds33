import { NextResponse } from "next/server";
import { z } from "zod";
import { ProjectConfigSchema } from "../_schemas";
import { executeAds } from "@/ia/super-agent/ads";
import { canExecuteAds } from "@/ia/super-agent/ads/guards";

const Body = z.object({
  cfg: ProjectConfigSchema,
  plan: z.any(), // later: define strict schema for ads plan
  proposedDailyBudgetUsd: z.number().default(0),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { cfg, plan, proposedDailyBudgetUsd } = Body.parse(body);

  // Guardrails gate (MVP)
  const ok = canExecuteAds(cfg.guardrails, proposedDailyBudgetUsd);
  if (!ok) {
    return NextResponse.json(
      { error: "Guardrails blocked ads execution. Requires approval or budget too high." },
      { status: 403 }
    );
  }

  const result = await executeAds(cfg, plan);
  return NextResponse.json({ result });
}

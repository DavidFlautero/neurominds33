import { NextResponse } from "next/server";

import { RecommendationIdsSchema } from "../_schemas";
import { store } from "../_store";
import { buildQuotes } from "@/ia/super-agent/workflows/quotes";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const parsed = RecommendationIdsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { projectId, recommendationIds } = parsed.data;

  const allRecs = store.recommendationsByProject.get(projectId) ?? [];
  const selected =
    recommendationIds?.length
      ? allRecs.filter((r) => recommendationIds.includes(r.id))
      : allRecs;

  const quotes = buildQuotes(projectId, selected);

  // persist in store (v1 in-memory)
  store.quotesByProject.set(projectId, quotes);

  return NextResponse.json({ ok: true, projectId, quotes });
}

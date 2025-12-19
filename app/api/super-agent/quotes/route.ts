export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { RecommendationIdsSchema } from "../_schemas";
import { store } from "../_store";
import { buildQuote } from "@/ia/super-agent/workflows/quotes";

export async function POST(req: Request) {
  const body = await req.json();
  const { projectId, recommendationIds } = RecommendationIdsSchema.parse(body);

  const recs = store.recommendationsByProject.get(projectId) ?? [];
  const selected = recs.filter(r => recommendationIds.includes(r.id));

  if (!selected.length) {
    return NextResponse.json({ error: "No recommendations selected." }, { status: 400 });
  }

  const quote = buildQuote(projectId, selected);
  const quotes = store.quotesByProject.get(projectId) ?? [];
  quotes.push(quote);
  store.quotesByProject.set(projectId, quotes);

  return NextResponse.json({ quote });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") || "local";
  const quotes = store.quotesByProject.get(projectId) ?? [];
  return NextResponse.json({ projectId, quotes });
}

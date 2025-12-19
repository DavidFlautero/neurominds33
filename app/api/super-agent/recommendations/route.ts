export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { store } from "../_store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") || "local";
  const recommendations = store.recommendationsByProject.get(projectId) ?? [];
  return NextResponse.json({ projectId, recommendations });
}

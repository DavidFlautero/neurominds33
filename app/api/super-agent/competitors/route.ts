import { NextResponse } from "next/server";
import { z } from "zod";
import { store } from "../_store";

const Body = z.object({
  projectId: z.string().min(1),
  competitors: z.array(z.object({ name: z.string().min(1), url: z.string().url() })),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") || "local";
  const competitors = store.competitorsByProject.get(projectId) ?? [];
  return NextResponse.json({ projectId, competitors });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { projectId, competitors } = Body.parse(body);
  store.competitorsByProject.set(projectId, competitors);
  return NextResponse.json({ ok: true, projectId, competitors });
}

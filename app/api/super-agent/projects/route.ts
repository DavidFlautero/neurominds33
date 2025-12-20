import { NextResponse } from "next/server";
import { listProjects, upsertProject } from "@/lib/super-agent/projects";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateSchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  siteUrl: z.string().url(),
});

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ ok: true, projects });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const p = await upsertProject({ ...parsed.data, status: "created" });
  return NextResponse.json({ ok: true, project: p });
}

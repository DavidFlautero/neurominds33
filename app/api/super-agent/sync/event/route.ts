import { NextResponse } from "next/server";
import { getProject, updateStatus } from "@/ia/super-agent/state/projectState";

export async function POST(req: Request) {
  const { projectId } = await req.json();
  const project = getProject(projectId);

  if (!project) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  updateStatus(projectId, "synced");
  project.lastEventAt = Date.now();

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getProject } from "@/ia/super-agent/state/projectState";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId")!;
  const project = getProject(projectId);

  return NextResponse.json({
    status: project?.status ?? "created",
    lastEventAt: project?.lastEventAt ?? null,
  });
}

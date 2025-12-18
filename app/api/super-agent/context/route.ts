import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.projectId || !body?.context) {
    return NextResponse.json({ error: "Missing projectId or context" }, { status: 400 });
  }

  const project = await prisma.nmProject.findUnique({
    where: { id: body.projectId },
  });

  if (!project || project.status !== "synced") {
    return NextResponse.json(
      { error: "Project not synced" },
      { status: 403 }
    );
  }

  await prisma.nmProjectContext.upsert({
    where: { projectId: body.projectId },
    update: { context: body.context },
    create: {
      projectId: body.projectId,
      context: body.context,
    },
  });

  await prisma.nmProject.update({
    where: { id: body.projectId },
    data: { status: "context_ready" },
  });

  return NextResponse.json({ ok: true });
}

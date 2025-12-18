import { prisma } from "@/lib/prisma";

export async function requireReady(projectId: string) {
  const project = await prisma.nmProject.findUnique({
    where: { id: projectId },
    include: { context: true },
  });

  if (!project) return { ok: false, reason: "not_found" };
  if (project.status !== "context_ready")
    return { ok: false, reason: "not_ready" };

  return { ok: true };
}

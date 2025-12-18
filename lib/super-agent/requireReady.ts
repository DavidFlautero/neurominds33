import { prisma } from "@/lib/prisma";

export async function requireReady(projectId: string) {
  const project = await prisma.nmProject.findUnique({
    where: { id: projectId },
    include: { context: true },
  });

  if (!project) return { ok: false, reason: "not_found" };

  // listo cuando el wizard ya guardó contexto
  if (project.status !== "context_ready") {
    return { ok: false, reason: project.status };
  }

  return { ok: true, project };
}

export async function requireSynced(projectId: string) {
  const project = await prisma.nmProject.findUnique({ where: { id: projectId } });
  if (!project) return { ok: false, reason: "not_found" };
  if (project.status !== "synced" && project.status !== "context_ready") {
    return { ok: false, reason: project.status };
  }
  return { ok: true, project };
}

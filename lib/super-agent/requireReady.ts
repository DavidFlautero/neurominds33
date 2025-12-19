import { prisma } from "@/lib/prisma";

export async function requireProject(projectId: string) {
  const project = await prisma.nmProject.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("project_not_found");
  return project;
}

export async function requireSynced(projectId: string) {
  const project = await requireProject(projectId);
  if (project.status !== "synced") throw new Error("project_not_synced");
  return project;
}

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function SuperAgentRoot() {
  const project = await prisma.nmProject.findFirst({ orderBy: { createdAt: "desc" } });
  if (!project) redirect("/super-agent/scans");
  redirect(`/super-agent/scans?projectId=${project.id}`);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

import { redirect } from "next/navigation";

export default async function SuperAgentRoot() {
  const { prisma } = await import("@/lib/prisma");

  const project = await prisma.nmProject.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (!project) redirect("/super-agent/scans");
  redirect(`/super-agent/scans?projectId=${project.id}`);
}

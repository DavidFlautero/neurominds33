export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

import { Shell } from "../_components/Shell";

export default async function ScansPage({
  searchParams,
}: {
  searchParams: { projectId?: string };
}) {
  const { prisma } = await import("@/lib/prisma");

  const projectId = (searchParams?.projectId || "").trim();

  const project = projectId
    ? await prisma.nmProject.findUnique({ where: { id: projectId } })
    : await prisma.nmProject.findFirst({ orderBy: { createdAt: "desc" } });

  return (
    <Shell
      title="Scan & Sync"
      subtitle="Sincronice su sitio"
      projectId={project?.id}
      status={project?.status}
    >
      <div>
        <h2>Estado: {project?.status}</h2>
        <p>Site: {project?.siteUrl}</p>
        <button>Generar Snippet</button>
      </div>
    </Shell>
  );
}

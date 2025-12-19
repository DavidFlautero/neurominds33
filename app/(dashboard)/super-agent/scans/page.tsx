import { prisma } from "@/lib/prisma";
import { Shell } from "../_components/Shell";

export default async function ScansPage({ searchParams }: { searchParams: { projectId?: string } }) {
  const projectId = searchParams.projectId;
  const project = projectId 
    ? await prisma.nmProject.findUnique({ where: { id: projectId } })
    : await prisma.nmProject.findFirst({ orderBy: { createdAt: "desc" } });

  return (
    <Shell title="Scan & Sync" subtitle="Sincronice su sitio" projectId={project?.id} status={project?.status}>
      <div>
        <h2>Estado: {project?.status}</h2>
        <p>Site: {project?.siteUrl}</p>
        <button>Generar Snippet</button>
      </div>
    </Shell>
  );
}

import { redirect } from "next/navigation";
import { getProjects } from "@/lib/super-agent/projects";

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: { projectId?: string };
}) {
  const pid = searchParams.projectId;
  const projects = await getProjects();

  if (!pid && (!projects || projects.length === 0)) {
    redirect("/super-agent/onboarding");
  }

  const projectId = pid || projects[0].id;

  return (
    <div className="sa-card" style={{ maxWidth: 920, margin: "40px auto" }}>
      <h1 className="sa-title">Overview</h1>
      <p className="sa-subtitle">
        Proyecto activo: <b>{projectId}</b>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 24 }}>
        <div className="sa-card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600 }}>Estado</div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>
            Este panel se desbloquea por fases: Conexión → Contexto → Scan → Plan.
          </div>
        </div>

        <div className="sa-card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600 }}>Siguiente paso</div>
          <div style={{ marginTop: 10 }}>
            <a href={`/super-agent/connect?projectId=${projectId}`}>
              <button className="sa-btn secondary">Ver conexión / sincronización</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import ProjectSwitcher from "./_components/ProjectSwitcher";
import { Card, Pill } from "./_components/ui";

async function fetchOverview(projectId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/super-agent/overview?projectId=${encodeURIComponent(projectId)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

function toneFromStatus(status: string) {
  if (status === "context_ready") return { tone: "green" as const, label: "Listo para Plan IA" };
  if (status === "synced") return { tone: "yellow" as const, label: "Sync OK — Falta contexto" };
  if (status === "created") return { tone: "red" as const, label: "No conectado" };
  return { tone: "gray" as const, label: status };
}

export default async function SuperAgentHome({ searchParams }: { searchParams: { projectId?: string } }) {
  const projectId = searchParams.projectId || "";
  const data = projectId ? await fetchOverview(projectId) : null;

  const status = data?.project?.status || "unknown";
  const badge = toneFromStatus(status);

  const synced = data?.checklist?.synced ?? false;
  const contextReady = data?.checklist?.contextReady ?? false;

  const ctaHref = !synced
    ? `/super-agent/scans?projectId=${encodeURIComponent(projectId)}`
    : !contextReady
      ? `/super-agent/onboarding?projectId=${encodeURIComponent(projectId)}`
      : `/super-agent/plan?projectId=${encodeURIComponent(projectId)}`;

  const ctaLabel = !synced
    ? "Ir a sincronización"
    : !contextReady
      ? "Completar configuración inicial"
      : "Generar Plan IA (Semana 1)";

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Super Agent</h1>
          <div className="flex items-center gap-2">
            <Pill label={badge.label} tone={badge.tone} />
            {projectId ? <span className="text-xs text-muted-foreground">projectId: {projectId}</span> : null}
          </div>
        </div>
        <ProjectSwitcher />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Checklist de Agencia">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Sincronización (evento recibido)</span>
              <Pill label={synced ? "OK" : "Pendiente"} tone={synced ? "green" : "red"} />
            </div>
            <div className="flex items-center justify-between">
              <span>Contexto (wizard)</span>
              <Pill label={contextReady ? "OK" : "Pendiente"} tone={contextReady ? "green" : "yellow"} />
            </div>
            <div className="flex items-center justify-between">
              <span>Integraciones (Ads/GA4)</span>
              <Pill label="Pendiente" tone="gray" />
            </div>
          </div>

          <div className="mt-4">
            <a
              href={ctaHref}
              className="inline-flex w-full justify-center rounded-lg bg-black text-white px-4 py-2 text-sm"
            >
              {ctaLabel}
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              El flujo es: Sync → Contexto → Integraciones → Plan IA → Aprobaciones → Ejecución → Validación.
            </p>
          </div>
        </Card>

        <Card title="Señales del sitio">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Eventos recibidos</span>
              <span className="font-semibold">{data?.eventsCount ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Último evento</span>
              <span className="font-semibold">
                {data?.project?.lastEventAt ? new Date(data.project.lastEventAt).toLocaleString() : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>URL</span>
              <span className="font-semibold truncate max-w-[160px]">{data?.project?.siteUrl ?? "-"}</span>
            </div>
          </div>
        </Card>

        <Card title="KPIs (próximamente con Ads/GA4)">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border p-3 bg-white">
              <div className="text-xs text-muted-foreground">Spend</div>
              <div className="text-lg font-semibold">—</div>
            </div>
            <div className="rounded-lg border p-3 bg-white">
              <div className="text-xs text-muted-foreground">ROAS</div>
              <div className="text-lg font-semibold">—</div>
            </div>
            <div className="rounded-lg border p-3 bg-white">
              <div className="text-xs text-muted-foreground">CVR</div>
              <div className="text-lg font-semibold">—</div>
            </div>
            <div className="rounded-lg border p-3 bg-white">
              <div className="text-xs text-muted-foreground">AOV</div>
              <div className="text-lg font-semibold">—</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            En cuanto conectes Google Ads/GA4, estos widgets se llenan automáticamente.
          </p>
        </Card>
      </div>
    </div>
  );
}

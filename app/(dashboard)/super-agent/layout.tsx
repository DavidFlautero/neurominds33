import type { ReactNode } from "react";

export default function SuperAgentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Súper Agente</h1>
        <p className="text-sm text-muted-foreground">
          Centro de mando: scans, plan semanal, cotizaciones/tareas, aprobaciones, Ads y competencia.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        <a className="rounded-md border px-3 py-2 text-sm hover:bg-muted" href="/super-agent/settings">Settings</a>
        <a className="rounded-md border px-3 py-2 text-sm hover:bg-muted" href="/super-agent/scans">Scans</a>
        <a className="rounded-md border px-3 py-2 text-sm hover:bg-muted" href="/super-agent/plan">Plan</a>
        <a className="rounded-md border px-3 py-2 text-sm hover:bg-muted" href="/super-agent/quotes">Cotizaciones</a>
        <a className="rounded-md border px-3 py-2 text-sm hover:bg-muted" href="/super-agent/tasks">Tareas</a>
        <a className="rounded-md border px-3 py-2 text-sm hover:bg-muted" href="/super-agent/approvals">Aprobaciones</a>
        <a className="rounded-md border px-3 py-2 text-sm hover:bg-muted" href="/super-agent/ads">Ads</a>
        <a className="rounded-md border px-3 py-2 text-sm hover:bg-muted" href="/super-agent/competitors">Competencia</a>
        <a className="rounded-md border px-3 py-2 text-sm hover:bg-muted" href="/super-agent/logs">Logs</a>
      </nav>

      <div>{children}</div>
    </div>
  );
}

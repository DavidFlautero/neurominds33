import type { ReactNode } from "react";

export default function SuperAgentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Contenedor con contraste propio (no depende de variables de shadcn) */}
      <div className="relative z-10 mx-auto w-full max-w-7xl rounded-2xl border bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50">
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Súper Agente</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Centro de mando: scans, plan, cotizaciones/tareas, aprobaciones, Ads y competencia.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <a className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900" href="/super-agent/settings">Settings</a>
            <a className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900" href="/super-agent/scans">Scans</a>
            <a className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900" href="/super-agent/plan">Plan</a>
            <a className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900" href="/super-agent/quotes">Cotizaciones</a>
            <a className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900" href="/super-agent/tasks">Tareas</a>
            <a className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900" href="/super-agent/approvals">Aprobaciones</a>
            <a className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900" href="/super-agent/ads">Ads</a>
            <a className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900" href="/super-agent/competitors">Competencia</a>
            <a className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900" href="/super-agent/logs">Logs</a>
          </nav>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

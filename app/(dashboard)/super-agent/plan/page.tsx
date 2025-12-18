"use client";

import { useEffect, useState } from "react";

export default function PlanPage() {
  const [lastScan, setLastScan] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("nm_super_agent_last_scan");
    if (raw) setLastScan(JSON.parse(raw));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Plan semanal</h2>
      <p className="text-sm text-muted-foreground">
        MVP: se alimenta del último scan. Luego lo persistimos en DB y lo calculamos semanalmente.
      </p>

      {!lastScan && (
        <div className="rounded-xl border p-4 text-sm">
          Todavía no hay plan generado. Corré un scan en <a className="underline" href="/super-agent/scans">Scans</a>.
        </div>
      )}

      {lastScan?.recommendations?.length ? (
        <div className="space-y-3">
          {lastScan.recommendations.slice(0, 5).map((r: any, idx: number) => (
            <div key={idx} className="rounded-xl border p-4 space-y-1">
              <div className="font-medium">{r.title}</div>
              <div className="text-sm text-muted-foreground">{r.description}</div>
              <div className="text-xs text-muted-foreground">
                Tipo: {r.type} — Impacto: {r.expectedImpact?.kpi} {r.expectedImpact?.estimate} — Riesgo: {r.risk} — Esfuerzo: {r.effort}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

export default function ScansPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("nm_super_agent_settings");
    if (raw) setSettings(JSON.parse(raw));
  }, []);

  const payload = useMemo(() => settings ?? null, [settings]);

  async function runScan() {
    if (!payload) {
      alert("Primero guardá Settings.");
      return;
    }
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/super-agent/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    setResult(json);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Scans</h2>
          <p className="text-sm text-muted-foreground">
            Ejecuta un scan visual + comité y genera recomendaciones.
          </p>
        </div>

        <button
          disabled={loading}
          onClick={runScan}
          className="rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Escaneando..." : "Correr scan ahora"}
        </button>
      </div>

      {!payload && (
        <div className="rounded-xl border p-4 text-sm">
          No hay settings cargados. Ve a <a className="underline" href="/super-agent/settings">Settings</a> y guardá.
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="rounded-xl border p-4">
            <div className="font-medium">Resumen</div>
            <div className="text-sm text-muted-foreground">
              ScanId: {result?.scan?.scanId} — Recomendaciones: {result?.recommendations?.length ?? 0}
            </div>
          </div>

          <pre className="text-xs rounded-xl border p-3 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function CreateProjectCard() {
  const [projectId, setProjectId] = useState("demo-project");
  const [siteUrl, setSiteUrl] = useState("https://neuromind33.online");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function create() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/super-agent/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projectId.trim(), siteUrl: siteUrl.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "No se pudo crear el proyecto");

      window.location.href = `/super-agent/scans?projectId=${encodeURIComponent(projectId.trim())}`;
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm max-w-xl">
      <h2 className="text-xl font-bold">No hay proyectos todavía</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Para iniciar el Súper Agente primero se crea un proyecto y luego se sincroniza (snippet + eventos).
      </p>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-1">
          <span className="text-xs text-muted-foreground">Project ID</span>
          <input
            className="border rounded-md p-2"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="ej: tienda-panales"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-muted-foreground">URL del sitio</span>
          <input
            className="border rounded-md p-2"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://tusitio.com"
          />
        </label>

        {err && (
          <div className="rounded-lg border bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <button
          onClick={create}
          disabled={loading || !projectId.trim() || !siteUrl.trim()}
          className="rounded-lg bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
        >
          {loading ? "Creando…" : "Crear proyecto y sincronizar"}
        </button>

        <p className="text-xs text-muted-foreground">
          Tip: usá un projectId corto y estable. Luego podés tener múltiples proyectos por cliente.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type SyncStatus = {
  status: string;
  lastEventAt: number | null;
  siteUrl?: string | null;
};

function Pill({ label, tone }: { label: string; tone: "green" | "yellow" | "red" | "gray" }) {
  const map = {
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    gray: "bg-slate-100 text-slate-800 border-slate-200",
  };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[tone]}`}>{label}</span>;
}

function siriTextFor(status: string, lastEventAt: number | null) {
  if (status === "synced") return "Sincronización finalizada. Eventos OK.";
  if (status === "snippet_issued") return "Esperando eventos… pegá el snippet y cargá una página.";
  if (status === "created") return "Proyecto creado. Generá el snippet para iniciar.";
  if (status === "context_ready") return "Sync OK. Contexto cargado. Listo para Plan IA.";
  if (status === "unknown") return "Sin datos del proyecto.";
  if (lastEventAt) return "Evento recibido. Verificando…";
  return "Listo para sincronizar.";
}

export default function ScansClient() {
  const sp = useSearchParams();
  const projectId = useMemo(() => sp.get("projectId") || "", [sp]);

  const [siteUrl, setSiteUrl] = useState("https://neuromind33.online");
  const [status, setStatus] = useState<SyncStatus>({ status: "unknown", lastEventAt: null });
  const [snippet, setSnippet] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [loadingSnippet, setLoadingSnippet] = useState(false);
  const [polling, setPolling] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tone: "green" | "yellow" | "red" | "gray" =
    status.status === "synced" || status.status === "context_ready" ? "green" :
    status.status === "snippet_issued" ? "yellow" :
    status.status === "created" ? "red" : "gray";

  async function refreshStatus() {
    if (!projectId) return;
    const res = await fetch(`/api/super-agent/sync/status?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) throw new Error(data?.error || "No se pudo leer estado");
    setStatus(data);
    if (data?.siteUrl) setSiteUrl(data.siteUrl);
  }

  useEffect(() => {
    if (!projectId) return;
    refreshStatus().catch(() => {});
  }, [projectId]);

  useEffect(() => {
    if (!polling || !projectId) return;
    let alive = true;

    const tick = async () => {
      try { await refreshStatus(); } catch {}
      if (alive) setTimeout(tick, 2000);
    };

    tick();
    return () => { alive = false; };
  }, [polling, projectId]);

  async function generateSnippet() {
    if (!projectId) return;
    setLoadingSnippet(true);
    setErr(null);
    try {
      const res = await fetch("/api/super-agent/sync/snippet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, siteUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "No se pudo generar snippet");
      setSnippet(data.snippet || "");
      setEndpoint(data.endpoint || "");
      await refreshStatus();
      setPolling(true);
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setLoadingSnippet(false);
    }
  }

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setErr("No se pudo copiar. Probá copiar manualmente.");
    }
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Sincronización</h1>
          <div className="flex items-center gap-2">
            <Pill label={status.status} tone={tone} />
            {projectId ? <span className="text-xs text-muted-foreground">projectId: {projectId}</span> : null}
          </div>
        </div>
        <a className="text-sm underline" href={projectId ? `/super-agent?projectId=${encodeURIComponent(projectId)}` : "/super-agent"}>
          Volver al overview
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">1) Generar snippet</h2>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={polling} onChange={(e) => setPolling(e.target.checked)} />
              Polling
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-xs text-muted-foreground">URL del sitio</span>
            <input className="border rounded-md p-2" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} />
          </label>

          <button
            onClick={generateSnippet}
            disabled={loadingSnippet || !projectId || !siteUrl}
            className="rounded-lg bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
          >
            {loadingSnippet ? "Generando…" : "Generar snippet"}
          </button>

          {err && <div className="rounded-lg border bg-red-50 p-3 text-sm text-red-700">{err}</div>}
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
          <h2 className="font-semibold">2) Pegar y verificar</h2>

          <div className="rounded-lg border bg-slate-50 p-3 text-sm">
            <div className="font-semibold mb-1">Asistente</div>
            <div>{siriTextFor(status.status, status.lastEventAt)}</div>
          </div>

          {endpoint ? <div className="text-xs text-muted-foreground">Endpoint: <span className="font-mono">{endpoint}</span></div> : null}

          {snippet ? (
            <>
              <div className="flex items-center gap-2">
                <button onClick={copySnippet} className="rounded-lg border px-3 py-2 text-sm">
                  {copied ? "Copiado" : "Copiar snippet"}
                </button>
                <button onClick={() => refreshStatus().catch(() => {})} className="rounded-lg border px-3 py-2 text-sm">
                  Refrescar estado
                </button>
              </div>

              <textarea className="w-full h-56 border rounded-md p-3 font-mono text-xs" value={snippet} readOnly />
              <div className="text-xs text-muted-foreground">
                Pegalo en el head o antes de cerrar body. Luego abrí la web y navegá 1–2 páginas.
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Generá el snippet para ver el código aquí.</div>
          )}
        </div>
      </div>
    </div>
  );
}

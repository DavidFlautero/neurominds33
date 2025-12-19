"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type StatusResp = {
  status?: string;
  lastEventAt?: number | null;
  error?: string;
};

export default function ConnectPage() {
  const [projectId, setProjectId] = useState("demo-project");
  const [siteUrl, setSiteUrl] = useState("");
  const [snippet, setSnippet] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState<string | null>(null);

  const [status, setStatus] = useState<StatusResp | null>(null);
  const [polling, setPolling] = useState(false);
  const [loadingSnippet, setLoadingSnippet] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = useMemo(() => {
    return projectId.trim().length >= 3 && /^https?:\/\//i.test(siteUrl.trim());
  }, [projectId, siteUrl]);

  async function generateSnippet() {
    setError(null);
    setSnippet(null);
    setEndpoint(null);
    setLoadingSnippet(true);

    try {
      const res = await fetch("/api/super-agent/sync/snippet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projectId.trim(), siteUrl: siteUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo generar snippet");
      setSnippet(data.snippet);
      setEndpoint(data.endpoint);
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoadingSnippet(false);
    }
  }

  async function fetchStatus() {
    setError(null);
    try {
      const res = await fetch(`/api/super-agent/sync/status?projectId=${encodeURIComponent(projectId.trim())}`, {
        method: "GET",
      });
      const data = await res.json();
      setStatus(data);
    } catch (e: any) {
      setError(e?.message || "Error status");
    }
  }

  useEffect(() => {
    // status inicial si ya existe el projectId
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!polling) return;
    const id = setInterval(() => {
      fetchStatus();
    }, 1500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polling, projectId]);

  const synced = status?.status === "synced" && !!status?.lastEventAt;

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Conectar sitio (Sync)</h1>
              <p className="mt-1 text-sm text-white/60">
                Paso 1 obligatorio. Sin sync no se habilitan métricas, scan, ni plan.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                Estado: {synced ? "SYNced" : status?.status || "—"}
              </span>
              <button
                onClick={fetchStatus}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15"
              >
                Refrescar
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="text-sm font-semibold text-white/80">1) Datos del proyecto</h2>

              <label className="mt-4 block text-xs text-white/70">Project ID</label>
              <input
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
                placeholder="demo-project"
              />
              <p className="mt-2 text-xs text-white/50">
                Identificador interno. Luego lo hacemos “selector de proyecto”.
              </p>

              <label className="mt-4 block text-xs text-white/70">URL del sitio (donde pegás el snippet)</label>
              <input
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
                placeholder="https://tu-tienda.com"
              />
              <p className="mt-2 text-xs text-white/50">
                Debe ser pública y responder con HTTP 200.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={generateSnippet}
                  disabled={!canGenerate || loadingSnippet}
                  className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15 disabled:opacity-50"
                >
                  {loadingSnippet ? "Generando…" : "Generar snippet"}
                </button>

                <button
                  onClick={() => setPolling((v) => !v)}
                  className="rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/5"
                >
                  {polling ? "Detener polling" : "Iniciar polling"}
                </button>
              </div>

              {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="text-sm font-semibold text-white/80">2) Instalar snippet</h2>

              {!snippet ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  Generá el snippet y pegalo en tu web (ideal: antes de <code>{"</head>"}</code> o al final del{" "}
                  <code>{"<body>"}</code>).
                </div>
              ) : (
                <>
                  <p className="mt-4 text-xs text-white/60">Pegá este snippet en tu web:</p>
                  <textarea
                    readOnly
                    value={snippet}
                    className="mt-2 h-52 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-white/80 outline-none"
                  />
                  <div className="mt-3 text-xs text-white/50">
                    Endpoint de eventos: <span className="text-white/70">{endpoint}</span>
                  </div>
                </>
              )}

              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-white/70">3) Confirmar conexión</p>
                <p className="mt-1 text-sm text-white/70">
                  Cuando el snippet se ejecute, el estado cambia a <span className="text-white">synced</span>.
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                    status: {status?.status || "—"}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                    lastEventAt: {status?.lastEventAt ? new Date(status.lastEventAt).toLocaleString() : "—"}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href="/super-agent/overview"
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                      synced
                        ? "border-white/10 bg-white/10 hover:bg-white/15"
                        : "border-white/10 bg-white/5 text-white/40 pointer-events-none"
                    }`}
                  >
                    Ir a Scan / Overview
                  </Link>
                  <span className="text-xs text-white/50 self-center">
                    {synced ? "Listo." : "Bloqueado hasta sync."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-white/50">
            Nota: si estás probando desde el mismo dominio, el evento debería llegar al cargar la página. Si no llega, revisá
            que el snippet apunte al dominio correcto del backend (NEXT_PUBLIC_APP_URL).
          </div>
        </div>
      </div>
    </div>
  );
}

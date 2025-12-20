"use client";

import React, { useEffect, useMemo, useState } from "react";

type Project = {
  id: string;
  siteUrl: string;
  status: string;
  lastEventAt: number | null;
};

type SnippetResp = { snippet: string; endpoint?: string };

const LS_KEY = "nm33_super_agent_project_id";

async function j<T>(r: Response): Promise<T> {
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (data as any)?.error || `HTTP ${r.status}`;
    throw new Error(msg);
  }
  return data as T;
}

function normalizeUrl(u: string) {
  let url = (u || "").trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  url = url.replace(/\/+$/, "");
  return url;
}

export default function ConnectPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [status, setStatus] = useState<string>("created");
  const [lastEventAt, setLastEventAt] = useState<number | null>(null);

  const [name, setName] = useState("Mi tienda");
  const [siteUrl, setSiteUrl] = useState("https://");

  const [snippet, setSnippet] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [polling, setPolling] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedId) || null,
    [projects, selectedId]
  );

  async function loadProjects() {
    setLoading(true);
    setMsg("");
    try {
      const data = await j<{ ok: boolean; projects: Project[] }>(
        await fetch("/api/super-agent/projects", { cache: "no-store" })
      );
      const list = data.projects || [];
      setProjects(list);

      // auto-select: localStorage -> first project
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(LS_KEY) : null;
      const best = (saved && list.some((p) => p.id === saved)) ? saved : (list[0]?.id || "");
      if (best) {
        setSelectedId(best);
        if (typeof window !== "undefined") window.localStorage.setItem(LS_KEY, best);
      } else {
        setSelectedId("");
      }
    } catch (e: any) {
      setMsg(e?.message || "No se pudieron cargar proyectos");
    } finally {
      setLoading(false);
    }
  }

  async function refreshStatus(pid: string) {
    if (!pid) return;
    try {
      const r = await fetch(`/api/super-agent/sync/status?projectId=${encodeURIComponent(pid)}`, { cache: "no-store" });
      const data = await r.json().catch(() => ({}));
      setStatus(data?.status || "created");
      setLastEventAt(data?.lastEventAt || null);
    } catch {
      // silencio
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    refreshStatus(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (!polling || !selectedId) return;
    const t = setInterval(() => refreshStatus(selectedId), 2000);
    return () => clearInterval(t);
  }, [polling, selectedId]);

  async function createProject() {
    setMsg("");
    const url = normalizeUrl(siteUrl);
    if (!name.trim()) return setMsg("Falta el nombre del proyecto.");
    if (!url) return setMsg("Falta la URL del sitio.");
    try {
      const data = await j<{ ok: boolean; project: Project; reused?: boolean }>(
        await fetch("/api/super-agent/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), siteUrl: url }),
        })
      );
      const p = data.project;
      await loadProjects();
      setSelectedId(p.id);
      if (typeof window !== "undefined") window.localStorage.setItem(LS_KEY, p.id);
      setMsg(data.reused ? "Proyecto existente reutilizado." : "Proyecto creado.");
    } catch (e: any) {
      setMsg(e?.message || "No se pudo crear el proyecto");
    }
  }

  async function generateSnippet() {
    setMsg("");
    setSnippet("");
    setEndpoint("");
    if (!selectedId) return setMsg("Primero elegí o creá un proyecto.");
    try {
      // backend ya requiere projectId existente
      const data = await j<SnippetResp>(
        await fetch("/api/super-agent/sync/snippet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: selectedId, siteUrl: selectedProject?.siteUrl || "" }),
        })
      );
      setSnippet(data.snippet || "");
      setEndpoint(data.endpoint || "");
      setPolling(true);
      setMsg("Snippet generado. Pegalo en tu sitio y abrí el sitio para enviar el primer evento.");
    } catch (e: any) {
      setMsg(e?.message || "No se pudo generar el snippet");
    }
  }

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet || "");
      setMsg("Copiado al portapapeles.");
      setTimeout(() => setMsg(""), 1200);
    } catch {
      setMsg("No se pudo copiar. Copiá manualmente.");
    }
  }

  const synced = status === "synced";

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Conectar sitio (Sync)</h1>
            <p className="text-sm text-slate-300 mt-1">
              Paso obligatorio. Sin sync, no se habilitan <b>Scan</b>, <b>Plan</b> ni <b>Ads</b>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs border ${synced ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-slate-700 bg-slate-900 text-slate-200"}`}>
              Estado: {status}
            </span>
            <button
              onClick={() => selectedId && refreshStatus(selectedId)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Refrescar
            </button>
          </div>
        </div>

        {msg ? (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
            {msg}
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Projects */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold">1) Proyecto</h2>
            <p className="text-sm text-slate-300 mt-1">
              Elegí un proyecto existente o creá uno nuevo. El snippet se genera <b>solo</b> para proyectos guardados.
            </p>

            <div className="mt-4">
              <div className="text-xs text-slate-400 mb-2">Proyectos existentes</div>
              {loading ? (
                <div className="text-sm text-slate-300">Cargando...</div>
              ) : projects.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-sm text-slate-300">
                  Todavía no tenés proyectos creados.
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedId(p.id);
                        setSnippet("");
                        setEndpoint("");
                        setPolling(false);
                        if (typeof window !== "undefined") window.localStorage.setItem(LS_KEY, p.id);
                      }}
                      className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                        p.id === selectedId
                          ? "border-indigo-400/40 bg-indigo-400/10"
                          : "border-slate-800 bg-slate-950/20 hover:bg-slate-950/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">Proyecto</div>
                          <div className="text-xs text-slate-300 mt-1">{p.siteUrl}</div>
                          <div className="text-[11px] text-slate-500 mt-1">ID: {p.id}</div>
                        </div>
                        <span className="text-xs rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
                          {p.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4">
              <div className="text-sm font-semibold">Crear nuevo proyecto</div>
              <div className="mt-3 grid gap-3">
                <label className="grid gap-1">
                  <span className="text-xs text-slate-300">Nombre del proyecto</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm outline-none focus:border-indigo-400/40"
                    placeholder="Ej: Tienda Pañales"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-slate-300">URL del sitio</span>
                  <input
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm outline-none focus:border-indigo-400/40"
                    placeholder="https://tu-dominio.com"
                  />
                  <span className="text-[11px] text-slate-500">Debe ser pública y cargar correctamente (HTTP 200).</span>
                </label>

                <button
                  onClick={createProject}
                  className="rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white"
                >
                  Crear proyecto
                </button>
              </div>
            </div>
          </div>

          {/* Right: Snippet */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold">2) Instalar snippet</h2>
            <p className="text-sm text-slate-300 mt-1">
              Generá el código para el proyecto seleccionado y pegalo en tu web. Cuando llegue el primer evento, el estado pasa a <b>synced</b>.
            </p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Proyecto seleccionado:{" "}
                <span className="text-slate-200">{selectedId ? selectedId : "— ninguno —"}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateSnippet}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm hover:bg-slate-800"
                >
                  Generar código
                </button>
                <button
                  onClick={() => setPolling((v) => !v)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm hover:bg-slate-800"
                  disabled={!selectedId}
                >
                  {polling ? "Detener polling" : "Activar polling"}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">Snippet</div>
                <button
                  onClick={copySnippet}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-50"
                  disabled={!snippet}
                >
                  Copiar
                </button>
              </div>

              <div className="mt-2 relative">
                <pre className="max-h-[320px] overflow-auto rounded-2xl border border-slate-800 bg-[#0b0d10] p-4 text-[13px] leading-6 text-slate-100">
                  <code>{snippet || "Generá el código para ver el snippet aquí."}</code>
                </pre>
              </div>

              {endpoint ? (
                <div className="mt-3 text-xs text-slate-400">
                  Endpoint: <span className="text-slate-200">{endpoint}</span>
                </div>
              ) : null}

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/20 p-4 text-sm text-slate-200">
                <div className="font-semibold">Cómo verificar el sync</div>
                <ol className="mt-2 list-decimal pl-5 text-slate-300 space-y-1">
                  <li>Pegá el snippet en tu sitio (por ejemplo antes de <code>{"</body>"}</code>).</li>
                  <li>Abrí tu sitio en el navegador (una visita real).</li>
                  <li>Este panel debe cambiar a <b>Estado: synced</b>.</li>
                </ol>
                <div className="mt-3 text-xs text-slate-400">
                  Último evento:{" "}
                  <span className="text-slate-200">{lastEventAt ? new Date(lastEventAt).toLocaleString() : "—"}</span>
                </div>
              </div>

              {synced ? (
                <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                  Sync confirmado. Ya podés usar <b>Scan</b>, <b>Plan</b> y <b>Ads</b>.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

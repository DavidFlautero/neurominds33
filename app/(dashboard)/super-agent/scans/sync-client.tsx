"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "created" | "synced" | "paused";

export default function ScanSyncClient({
  projectId,
  siteUrl,
  status: initialStatus,
}: {
  projectId: string;
  siteUrl: string;
  status: Status;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [lastEventAt, setLastEventAt] = useState<number | null>(null);
  const [snippet, setSnippet] = useState<string>("");
  const [loadingSnippet, setLoadingSnippet] = useState(false);
  const [polling, setPolling] = useState(false);
  const [err, setErr] = useState<string>("");

  const endpoint = useMemo(() => `${window.location.origin}/api/super-agent/sync/event`, []);

  async function fetchSnippet() {
    setErr("");
    setLoadingSnippet(true);
    try {
      const res = await fetch("/api/super-agent/sync/snippet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, siteUrl }),
      });
      const j = await res.json();
      if (!res.ok || !j?.snippet) throw new Error(j?.error || "snippet_error");
      setSnippet(j.snippet);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoadingSnippet(false);
    }
  }

  async function pollOnce() {
    const res = await fetch(`/api/super-agent/sync/status?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" });
    const j = await res.json();
    if (res.ok && j?.status) {
      setStatus(j.status);
      setLastEventAt(j.lastEventAt || null);
      if (j.status === "synced") return true;
    }
    return false;
  }

  async function startPolling() {
    setErr("");
    setPolling(true);
    const start = Date.now();
    while (Date.now() - start < 120000) { // 2 min
      const done = await pollOnce();
      if (done) break;
      await new Promise((r) => setTimeout(r, 2000));
    }
    setPolling(false);
  }

  useEffect(() => {
    // best effort: refresh status on mount
    pollOnce().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const badge =
    status === "synced" ? "Sincronizado" : status === "created" ? "Pendiente de Sync" : "Pausado";

  return (
    <div className="sa-grid">
      <div className="sa-panel">
        <div className="sa-row">
          <div>
            <div className="sa-h">Estado</div>
            <div className="sa-pill big">
              {badge}
              <span className="sa-dot" data-status={status} />
            </div>
            <div className="sa-help" style={{ marginTop: 10 }}>
              Project: <strong>{projectId}</strong> · Site: <strong>{siteUrl}</strong>
            </div>
            {lastEventAt ? (
              <div className="sa-help">Último evento: <strong>{new Date(lastEventAt).toLocaleString()}</strong></div>
            ) : (
              <div className="sa-help">Último evento: <strong>—</strong></div>
            )}
          </div>

          <div className="sa-actions compact">
            <button className="sa-btn secondary" onClick={fetchSnippet} disabled={loadingSnippet}>
              {loadingSnippet ? "Generando…" : "Generar snippet"}
            </button>
            <button className="sa-btn" onClick={startPolling} disabled={polling}>
              {polling ? "Verificando…" : "Iniciar verificación"}
            </button>
          </div>
        </div>

        {err ? <div className="sa-alert danger">Error: {err}</div> : null}

        <div className="sa-section">
          <div className="sa-label">Snippet JS</div>
          <div className="sa-help">
            Instálelo en su sitio (head o before-body-end). Luego recargue la página y presione “Iniciar verificación”.
          </div>

          <textarea className="sa-textarea" value={snippet || ""} readOnly placeholder="Genere el snippet para ver el código aquí." />

          <div className="sa-actions">
            <button
              className="sa-btn secondary"
              onClick={() => {
                if (!snippet) return;
                navigator.clipboard.writeText(snippet);
              }}
              disabled={!snippet}
            >
              Copiar
            </button>

            {status === "synced" ? (
              <a className="sa-btn" href={`/super-agent/plan?projectId=${encodeURIComponent(projectId)}`}>
                Continuar a Plan
              </a>
            ) : (
              <span className="sa-help">Plan/Ads/Competencia se desbloquean cuando el estado pase a <strong>synced</strong>.</span>
            )}
          </div>

          <div className="sa-note">
            Si tarda mucho o falla: revise que el endpoint sea el correcto (dominio final), y que el sitio pueda hacer fetch a HTTPS.
            Si hay error, el sistema debe mostrarlo (no quedarse “buscando”).
          </div>
        </div>
      </div>

      <div className="sa-panel soft">
        <div className="sa-h">Qué valida esta etapa</div>
        <ul className="sa-list">
          <li>Que el snippet envía <strong>page_view</strong> correctamente.</li>
          <li>Que el proyecto cambia de <strong>created</strong> a <strong>synced</strong>.</li>
          <li>Que el sistema ya puede iniciar el primer scan y generar veredictos.</li>
        </ul>

        <div className="sa-alert">
          Nota: todavía no ejecutamos Ads. En fase 1 solo habilitamos diagnóstico y gating profesional.
        </div>

        <div className="sa-kv" style={{ marginTop: 14 }}>
          <span>Endpoint</span>
          <strong style={{ wordBreak: "break-all" }}>{endpoint}</strong>
        </div>
      </div>
    </div>
  );
}

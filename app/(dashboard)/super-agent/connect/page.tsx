"use client";

import { useEffect, useMemo, useState } from "react";
import { getJSON, postJSON } from "@/lib/super-agent/client";

type SnippetResp = { snippet: string; endpoint: string };
type StatusResp = { status: "created" | "synced"; lastEventAt: number | null };

function CosmicOrb({ status }: { status: "idle" | "waiting" | "synced" | "error" }) {
  const label =
    status === "idle" ? "Listo para sincronizar" :
    status === "waiting" ? "Esperando conexión…" :
    status === "synced" ? "Sincronización finalizada" :
    "Error de conexión";

  const glow =
    status === "synced" ? "rgba(74,222,128,.18)" :
    status === "error" ? "rgba(255,107,107,.18)" :
    "rgba(124,156,255,.18)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,.35), ${glow})`,
          border: "1px solid var(--panel-border)",
          boxShadow: `0 0 40px ${glow}`,
        }}
      />
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>
          No avanzamos al diagnóstico hasta confirmar eventos reales.
        </div>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  const [siteUrl, setSiteUrl] = useState("");
  const [projectId, setProjectId] = useState("");
  const [snippet, setSnippet] = useState<SnippetResp | null>(null);
  const [phase, setPhase] = useState<"idle" | "waiting" | "synced" | "error">("idle");
  const [status, setStatus] = useState<StatusResp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const canGenerate = useMemo(() => {
    try {
      const u = new URL(siteUrl);
      return !!projectId && (u.protocol === "http:" || u.protocol === "https:");
    } catch {
      return false;
    }
  }, [siteUrl, projectId]);

  async function generate() {
    setErr(null);
    setSnippet(null);
    setStatus(null);
    setPhase("idle");

    try {
      // 1) Crear el proyecto (si tu API actual ya lo crea al pedir snippet, perfecto)
      const s = await postJSON<SnippetResp>("/api/super-agent/sync/snippet", {
        projectId,
        siteUrl,
      });
      setSnippet(s);
      setPhase("waiting");
    } catch (e: any) {
      setErr(e?.message || "Error generando snippet");
      setPhase("error");
    }
  }

  // Polling status cuando ya hay snippet
  useEffect(() => {
    if (!snippet || !projectId) return;

    let cancelled = false;
    let t: any = null;

    async function tick() {
      try {
        const st = await getJSON<StatusResp>(`/api/super-agent/sync/status?projectId=${encodeURIComponent(projectId)}`);
        if (cancelled) return;
        setStatus(st);

        if (st.status === "synced" && st.lastEventAt) {
          setPhase("synced");
          return; // stop polling
        }
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message || "Error consultando estado");
          setPhase("error");
        }
      }
      t = setTimeout(tick, 1500);
    }

    tick();

    return () => {
      cancelled = true;
      if (t) clearTimeout(t);
    };
  }, [snippet, projectId]);

  return (
    <div className="sa-card" style={{ maxWidth: 920, margin: "40px auto" }}>
      <h1 className="sa-title">Conectar tu sitio</h1>
      <p className="sa-subtitle">
        Primero conectamos tu web para capturar eventos reales. Sin esto, el asistente no puede
        auditar ni planificar como una agencia profesional.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 18, marginTop: 24 }}>
        <div className="sa-card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Datos del proyecto</div>

          <label className="sa-subtitle">URL del sitio</label>
          <input
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            type="url"
            placeholder="https://tusitio.com"
            style={{
              marginTop: 8,
              width: "100%",
              padding: 14,
              borderRadius: 12,
              background: "#0b0d10",
              border: "1px solid #1e2430",
              color: "white",
            }}
          />

          <div style={{ marginTop: 18 }}>
            <label className="sa-subtitle">Project ID (interno)</label>
            <input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              type="text"
              placeholder="mi-tienda-online"
              style={{
                marginTop: 8,
                width: "100%",
                padding: 14,
                borderRadius: 12,
                background: "#0b0d10",
                border: "1px solid #1e2430",
                color: "white",
              }}
            />
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>
              Recomendación: minúsculas + guiones. Ej: <code>panales-online-ar</code>
            </div>
          </div>

          <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
            <button className="sa-btn" disabled={!canGenerate} onClick={generate}>
              Generar snippet
            </button>
            <a href="/super-agent/onboarding">
              <button className="sa-btn secondary" type="button">Volver</button>
            </a>
          </div>

          {err && (
            <div style={{ marginTop: 16, color: "var(--danger)" }}>
              {err}
            </div>
          )}

          <CosmicOrb status={phase} />

          {status && (
            <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 12 }}>
              Estado: <b>{status.status}</b>
              {" · "}
              lastEventAt: <b>{status.lastEventAt ? new Date(status.lastEventAt).toLocaleString() : "—"}</b>
            </div>
          )}

          {phase === "synced" && (
            <div style={{ marginTop: 18 }}>
              <a href={`/super-agent/wizard?projectId=${encodeURIComponent(projectId)}`}>
                <button className="sa-btn">Continuar al brief (wizard)</button>
              </a>
            </div>
          )}
        </div>

        <div className="sa-card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Código de conexión</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
            Pegá este script en tu sitio (antes de cerrar <code>{"</body>"}</code>).
            Cuando recibamos eventos, se habilita el siguiente paso.
          </div>

          <textarea
            readOnly
            value={snippet?.snippet || ""}
            placeholder="Generá el snippet para verlo aquí…"
            style={{
              width: "100%",
              minHeight: 320,
              padding: 12,
              borderRadius: 12,
              background: "#0b0d10",
              border: "1px solid #1e2430",
              color: "white",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 12,
              whiteSpace: "pre",
            }}
          />

          {snippet?.snippet && (
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                className="sa-btn secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(snippet.snippet);
                  } catch {}
                }}
              >
                Copiar
              </button>

              <button
                className="sa-btn secondary"
                onClick={async () => {
                  setErr(null);
                  setPhase("waiting");
                  try {
                    const st = await getJSON<StatusResp>(`/api/super-agent/sync/status?projectId=${encodeURIComponent(projectId)}`);
                    setStatus(st);
                    if (st.status === "synced" && st.lastEventAt) setPhase("synced");
                  } catch (e: any) {
                    setErr(e?.message || "Error consultando estado");
                    setPhase("error");
                  }
                }}
              >
                Reintentar status
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

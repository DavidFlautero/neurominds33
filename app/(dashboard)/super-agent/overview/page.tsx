import Link from "next/link";

export const dynamic = "force-dynamic";

async function getJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return res.json();
}

export default async function OverviewPage() {
  const projectId = "demo-project";
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const data = await getJson(`${base}/api/super-agent/overview?projectId=${encodeURIComponent(projectId)}`);

  const readiness = data?.readiness || {};
  const score = data?.snapshot?.score ?? "—";
  const headline = data?.snapshot?.headline ?? "Generá tu plan para ver el diagnóstico tipo agencia.";

  return (
    <div className="sa-shell">
      <div className="sa-card">
        <div className="sa-title">Super Agent — Overview</div>
        <div className="sa-subtitle">{headline}</div>

        <div className="sa-step">
          <div className="sa-kpi">
            <div className="sa-kpi-label">Score</div>
            <div className="sa-kpi-value">{score}</div>
          </div>
          <div className="sa-kpi">
            <div className="sa-kpi-label">Context</div>
            <div className="sa-kpi-value">{readiness.hasContext ? "OK" : "Pendiente"}</div>
          </div>
          <div className="sa-kpi">
            <div className="sa-kpi-label">Scan</div>
            <div className="sa-kpi-value">{readiness.hasScan ? "OK" : "Pendiente"}</div>
          </div>
          <div className="sa-kpi">
            <div className="sa-kpi-label">Plan</div>
            <div className="sa-kpi-value">{readiness.hasPlan ? "OK" : "Pendiente"}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <Link className="sa-btn secondary" href="/super-agent/context">1) Contexto (Wizard)</Link>
          <Link className="sa-btn secondary" href="/super-agent/scans">2) Scan</Link>
          <Link className="sa-btn" href="/super-agent/plan">3) Plan</Link>
        </div>

        <div style={{ marginTop: 18 }} className="sa-muted">
          Logs recientes (debug):
        </div>
        <div className="sa-log">
          {(data?.logs || []).slice(0, 10).map((l: any) => (
            <div key={l.ts} className="sa-log-row">
              <span className="sa-chip">{new Date(l.ts).toLocaleString()}</span>
              <span className="sa-muted">{l.type}</span>
              {typeof l.score !== "undefined" ? <span className="sa-chip">score {l.score}</span> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

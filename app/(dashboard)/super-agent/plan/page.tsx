export const dynamic = "force-dynamic";

async function getJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return res.json();
}

async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return res.json();
}

export default async function PlanPage() {
  const projectId = "demo-project";
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const existing = await getJson(`${base}/api/super-agent/plan?projectId=${encodeURIComponent(projectId)}`);
  const plan = existing?.plan || null;

  return (
    <div className="sa-shell">
      <div className="sa-card">
        <div className="sa-title">Plan de Acción (v1)</div>
        <div className="sa-subtitle">
          Comité multi-agente + auditor. Cada acción incluye ventaja, riesgo y resultado esperado.
        </div>

        <form
          action={async () => {
            "use server";
            await postJson(`${base}/api/super-agent/plan`, { projectId });
          }}
          style={{ marginTop: 16 }}
        >
          <button className="sa-btn" type="submit">Generar / Regenerar Plan</button>
        </form>

        {!plan ? (
          <div className="sa-empty">
            <div className="sa-empty-title">Todavía no hay plan.</div>
            <div className="sa-muted">
              Primero: completá Contexto (Wizard) y Scan. Luego generás el plan.
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 18 }}>
            <div className="sa-step">
              <div className="sa-kpi">
                <div className="sa-kpi-label">Status</div>
                <div className="sa-kpi-value">{plan.summary.status}</div>
              </div>
              <div className="sa-kpi">
                <div className="sa-kpi-label">Score</div>
                <div className="sa-kpi-value">{plan.summary.score}</div>
              </div>
              <div className="sa-kpi">
                <div className="sa-kpi-label">Ads readiness</div>
                <div className="sa-kpi-value">{plan.summary.adsReadiness}</div>
              </div>
            </div>

            <div className="sa-muted" style={{ marginTop: 12 }}>
              {plan.summary.headline}
            </div>

            <div className="sa-weeks">
              {plan.weeks.map((w: any) => (
                <div key={w.week} className="sa-week">
                  <div className="sa-week-head">
                    <div className="sa-week-title">Semana {w.week}</div>
                    <div className="sa-muted">{(w.goals || []).join(" · ")}</div>
                  </div>

                  {(w.actions || []).length === 0 ? (
                    <div className="sa-muted">Sin acciones (reservado para próximo ciclo).</div>
                  ) : (
                    <div className="sa-actions">
                      {w.actions.map((a: any) => (
                        <div key={a.id} className="sa-action">
                          <div className="sa-action-top">
                            <div className="sa-action-title">{a.title}</div>
                            <div className="sa-badges">
                              <span className="sa-chip">P{a.priority}</span>
                              <span className="sa-chip">Effort {a.effort}</span>
                              <span className={`sa-chip ${a.risk.level}`}>Risk {a.risk.level}</span>
                              {a.requiresApproval ? <span className="sa-chip warn">Requiere aprobación</span> : null}
                            </div>
                          </div>

                          <div className="sa-cols">
                            <div>
                              <div className="sa-mini-title">Ventaja</div>
                              <div className="sa-muted">{a.advantage}</div>
                            </div>
                            <div>
                              <div className="sa-mini-title">Resultado esperado</div>
                              <div className="sa-muted">
                                {a.expected.metric} {a.expected.delta} · {a.expected.timeframe}
                              </div>
                            </div>
                          </div>

                          <div className="sa-cols" style={{ marginTop: 10 }}>
                            <div>
                              <div className="sa-mini-title">Riesgo</div>
                              <div className="sa-muted">{a.risk.notes}</div>
                            </div>
                            <div>
                              <div className="sa-mini-title">Rollback</div>
                              <ul className="sa-list">
                                {(a.rollback || []).slice(0, 3).map((r: string, idx: number) => (
                                  <li key={idx} className="sa-muted">{r}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div style={{ marginTop: 10 }}>
                            <div className="sa-mini-title">Cómo se hace</div>
                            <ul className="sa-list">
                              {(a.how || []).slice(0, 4).map((h: string, idx: number) => (
                                <li key={idx} className="sa-muted">{h}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18 }}>
              <div className="sa-mini-title">Comité (resumen)</div>
              <div className="sa-muted">
                Decisión: <b>{plan.committee.consensus.decision}</b> · Blockers: {plan.committee.consensus.blockers.length} · Warnings: {plan.committee.consensus.warnings.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

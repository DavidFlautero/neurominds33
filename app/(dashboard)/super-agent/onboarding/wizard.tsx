"use client";

import { useMemo, useState } from "react";

type Step = 1 | 2 | 3;

const GOALS = [
  { id: "sales", label: "Maximizar ventas", desc: "Optimización a conversión y ROAS." },
  { id: "leads", label: "Generar leads", desc: "Prioriza captación y seguimiento." },
  { id: "traffic", label: "Tráfico calificado", desc: "Para marca / volumen con control." },
];

const EXPERIENCE = [
  { id: "new", label: "Primera vez con Ads", desc: "Necesita guía total." },
  { id: "some", label: "Algo de experiencia", desc: "Ajustes y optimización." },
  { id: "pro", label: "Avanzado", desc: "Control fino y auditoría." },
];

const BUDGET = [
  { id: "low", label: "Bajo", desc: "USD 3–10 / día (validación inicial)" },
  { id: "mid", label: "Medio", desc: "USD 10–30 / día (tracción)" },
  { id: "high", label: "Alto", desc: "USD 30+ / día (escala)" },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [projectId, setProjectId] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [goal, setGoal] = useState<string>("sales");
  const [exp, setExp] = useState<string>("new");
  const [budget, setBudget] = useState<string>("mid");

  const canNext1 = useMemo(() => projectId.trim().length >= 3 && siteUrl.trim().length >= 8, [projectId, siteUrl]);

  async function createProject() {
    const res = await fetch("/api/super-agent/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: projectId.trim(), siteUrl: siteUrl.trim() }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.ok) {
      alert(`No se pudo crear: ${json?.error || "error"}`);
      return;
    }

    // (Opcional) guardamos onboarding mínimo en localStorage (fase 1)
    localStorage.setItem(
      `sa:onboarding:${projectId.trim()}`,
      JSON.stringify({ goal, exp, budget, ts: Date.now() })
    );

    // Enviar directo a Scan & Sync
    window.location.href = `/super-agent/scans?projectId=${encodeURIComponent(projectId.trim())}`;
  }

  return (
    <div className="sa-grid">
      <div className="sa-panel">
        <div className="sa-h">Paso {step} de 3</div>

        {step === 1 ? (
          <>
            <div className="sa-section">
              <div className="sa-label">Project ID</div>
              <div className="sa-help">Identificador corto. Sin espacios. Ej: panalesonline</div>
              <input className="sa-input" value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="demo-project" />
            </div>

            <div className="sa-section">
              <div className="sa-label">URL del sitio</div>
              <div className="sa-help">Donde se integrará el snippet de sincronización.</div>
              <input className="sa-input" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://mitienda.com" />
            </div>

            <div className="sa-actions">
              <button className="sa-btn secondary" onClick={() => (window.location.href = "/super-agent/scans")}>
                Salir sin guiado
              </button>
              <button className="sa-btn" disabled={!canNext1} onClick={() => setStep(2)}>
                Siguiente
              </button>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="sa-section">
              <div className="sa-label">Objetivo principal</div>
              <div className="sa-cards">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    className={`sa-choice ${goal === g.id ? "active" : ""}`}
                    onClick={() => setGoal(g.id)}
                    type="button"
                  >
                    <div className="sa-choice-title">{g.label}</div>
                    <div className="sa-choice-desc">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="sa-section">
              <div className="sa-label">Experiencia con Ads</div>
              <div className="sa-cards">
                {EXPERIENCE.map((x) => (
                  <button
                    key={x.id}
                    className={`sa-choice ${exp === x.id ? "active" : ""}`}
                    onClick={() => setExp(x.id)}
                    type="button"
                  >
                    <div className="sa-choice-title">{x.label}</div>
                    <div className="sa-choice-desc">{x.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="sa-actions">
              <button className="sa-btn secondary" onClick={() => setStep(1)}>
                Atrás
              </button>
              <button className="sa-btn" onClick={() => setStep(3)}>
                Siguiente
              </button>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="sa-section">
              <div className="sa-label">Rango de inversión</div>
              <div className="sa-cards">
                {BUDGET.map((b) => (
                  <button
                    key={b.id}
                    className={`sa-choice ${budget === b.id ? "active" : ""}`}
                    onClick={() => setBudget(b.id)}
                    type="button"
                  >
                    <div className="sa-choice-title">{b.label}</div>
                    <div className="sa-choice-desc">{b.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="sa-summary">
              <div className="sa-h">Resumen</div>
              <div className="sa-kv"><span>Project ID</span><strong>{projectId.trim() || "-"}</strong></div>
              <div className="sa-kv"><span>URL</span><strong>{siteUrl.trim() || "-"}</strong></div>
              <div className="sa-kv"><span>Objetivo</span><strong>{goal}</strong></div>
              <div className="sa-kv"><span>Experiencia</span><strong>{exp}</strong></div>
              <div className="sa-kv"><span>Presupuesto</span><strong>{budget}</strong></div>
              <div className="sa-help" style={{ marginTop: 10 }}>
                Siguiente: se genera el snippet y se monitorea el evento de sincronización (polling).
              </div>
            </div>

            <div className="sa-actions">
              <button className="sa-btn secondary" onClick={() => setStep(2)}>
                Atrás
              </button>
              <button className="sa-btn" onClick={createProject}>
                Crear proyecto y continuar
              </button>
            </div>
          </>
        ) : null}
      </div>

      <div className="sa-panel soft">
        <div className="sa-h">Qué va a pasar ahora</div>
        <ul className="sa-list">
          <li>Usted integra un snippet JS (1 línea) en su tienda.</li>
          <li>El sistema espera un primer evento y cambia a <strong>synced</strong>.</li>
          <li>Se desbloquean Plan, Ads y Competencia.</li>
          <li>El primer scan genera veredicto “Apta para Ads” con riesgos/beneficios.</li>
        </ul>
        <div className="sa-note">
          Criterio duro: si el sitio no está listo para Ads, el sistema bloquea ejecución y recomienda ajustes antes de invertir.
        </div>
      </div>
    </div>
  );
}

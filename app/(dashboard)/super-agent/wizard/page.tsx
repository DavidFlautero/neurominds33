"use client";

import { useMemo, useState } from "react";

type Option = { id: string; title: string; desc: string };

const SITE_AGE: Option[] = [
  { id: "lt_30", title: "Menos de 30 días", desc: "El foco es validación y aprendizaje rápido." },
  { id: "1_3m", title: "1–3 meses", desc: "Podemos testear campañas con presupuesto controlado." },
  { id: "3_12m", title: "3–12 meses", desc: "Ya hay señales para optimizar conversión y Ads." },
  { id: "gt_1y", title: "Más de 1 año", desc: "Se prioriza eficiencia, ROAS y escalamiento." },
];

const ADS_HISTORY: Option[] = [
  { id: "never", title: "Nunca hice publicidad", desc: "Estrategia conservadora y educativa." },
  { id: "bad", title: "Sí, pero sin resultados", desc: "Auditar tracking, oferta y landings." },
  { id: "ok", title: "Sí, resultados aceptables", desc: "Optimización y expansión controlada." },
  { id: "good", title: "Sí, buenos resultados", desc: "Escala y optimización avanzada." },
];

function CardSelect({
  title,
  subtitle,
  options,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  options: Option[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <div className="sa-card" style={{ padding: 18 }}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ color: "var(--muted)", marginTop: 6, fontSize: 13 }}>{subtitle}</div>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className="sa-card"
              style={{
                padding: 14,
                textAlign: "left",
                cursor: "pointer",
                borderColor: active ? "rgba(124,156,255,.6)" : "var(--panel-border)",
                boxShadow: active ? "0 0 0 1px rgba(124,156,255,.25)" : "none",
              }}
            >
              <div style={{ fontWeight: 600 }}>{o.title}</div>
              <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>{o.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function WizardPage() {
  const [siteAge, setSiteAge] = useState<string | null>(null);
  const [adsHistory, setAdsHistory] = useState<string | null>(null);

  const ready = useMemo(() => !!siteAge && !!adsHistory, [siteAge, adsHistory]);

  return (
    <div style={{ maxWidth: 920, margin: "40px auto" }}>
      <div className="sa-card">
        <h1 className="sa-title">Brief inicial (Wizard)</h1>
        <p className="sa-subtitle">
          Respondé con opciones. Esto evita ambigüedad y permite que el Comité de IA
          tome decisiones como una agencia seria.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18 }}>
        <CardSelect
          title="¿Hace cuánto está online tu sitio?"
          subtitle="Esto afecta expectativas, estrategia y ritmo de inversión."
          options={SITE_AGE}
          value={siteAge}
          onChange={setSiteAge}
        />

        <CardSelect
          title="¿Tuviste publicidad antes?"
          subtitle="Esto define si arrancamos con educación, auditoría o escalamiento."
          options={ADS_HISTORY}
          value={adsHistory}
          onChange={setAdsHistory}
        />
      </div>

      <div className="sa-card" style={{ marginTop: 18, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>
          Estado: {ready ? "Listo para guardar contexto" : "Completa las preguntas para continuar"}
        </div>

        <button className="sa-btn" disabled={!ready}>
          Guardar y continuar
        </button>
      </div>
    </div>
  );
}

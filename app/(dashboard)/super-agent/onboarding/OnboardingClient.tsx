"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const STEPS = [
  "Etapa",
  "Objetivo",
  "Presupuesto",
  "Experiencia Ads",
  "Control",
  "Audiencia",
  "Competencia",
];

type ContextState = {
  stage?: "0_30" | "1_3m" | "3_12m" | "1y";
  goal?: "sales" | "leads" | "traffic" | "branding";
  budgetMonthly?: "lt_300" | "300_1000" | "gt_1000";
  adsExperience?: "none" | "basic" | "advanced";
  controlMode?: "full_control" | "assist" | "read_only";
  audience?: "local" | "country" | "latam" | "global";
  competeOn?: "price" | "brand" | "service" | "delivery";
};

function Select({ value, onChange, options }: any) {
  return (
    <select className="w-full border p-2 rounded bg-white" value={value || ""} onChange={e => onChange(e.target.value)}>
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export default function OnboardingClient() {
  const sp = useSearchParams();
  const projectId = useMemo(() => sp.get("projectId") || "", [sp]);

  const [step, setStep] = useState(0);
  const [ctx, setCtx] = useState<ContextState>({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  async function finish() {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/super-agent/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, context: ctx }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar el contexto");

      window.location.href = `/super-agent?projectId=${encodeURIComponent(projectId)}`;
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  const missingProject = !projectId;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Brief inicial (Wizard)</h1>
          <p className="text-sm text-muted-foreground">
            Solo opciones. Esto alimenta el comité IA y fija límites/estrategia.
          </p>
          {projectId ? <div className="text-xs text-muted-foreground">projectId: {projectId}</div> : null}
        </div>

        {missingProject && (
          <div className="rounded-lg border bg-yellow-50 p-4 text-sm">
            Falta <b>projectId</b>. Volvé al overview y elegí un proyecto.
          </div>
        )}

        <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
          <div className="text-sm text-muted-foreground">
            Paso {step + 1} de {STEPS.length}: <b>{STEPS[step]}</b>
          </div>

          {step === 0 && (
            <Select
              value={ctx.stage}
              onChange={(v: any) => setCtx({ ...ctx, stage: v })}
              options={[
                { value: "", label: "¿Cuánto tiempo lleva la tienda?" },
                { value: "0_30", label: "0–30 días" },
                { value: "1_3m", label: "1–3 meses" },
                { value: "3_12m", label: "3–12 meses" },
                { value: "1y", label: "1+ año" },
              ]}
            />
          )}

          {step === 1 && (
            <Select
              value={ctx.goal}
              onChange={(v: any) => setCtx({ ...ctx, goal: v })}
              options={[
                { value: "", label: "Objetivo principal" },
                { value: "sales", label: "Ventas" },
                { value: "leads", label: "Leads" },
                { value: "traffic", label: "Tráfico" },
                { value: "branding", label: "Branding" },
              ]}
            />
          )}

          {step === 2 && (
            <Select
              value={ctx.budgetMonthly}
              onChange={(v: any) => setCtx({ ...ctx, budgetMonthly: v })}
              options={[
                { value: "", label: "Presupuesto mensual" },
                { value: "lt_300", label: "< 300 USD" },
                { value: "300_1000", label: "300–1.000 USD" },
                { value: "gt_1000", label: "1.000+ USD" },
              ]}
            />
          )}

          {step === 3 && (
            <Select
              value={ctx.adsExperience}
              onChange={(v: any) => setCtx({ ...ctx, adsExperience: v })}
              options={[
                { value: "", label: "Experiencia en Ads" },
                { value: "none", label: "Ninguna" },
                { value: "basic", label: "Básica" },
                { value: "advanced", label: "Avanzada" },
              ]}
            />
          )}

          {step === 4 && (
            <Select
              value={ctx.controlMode}
              onChange={(v: any) => setCtx({ ...ctx, controlMode: v })}
              options={[
                { value: "", label: "Modo de control" },
                { value: "full_control", label: "Control total (agencia)" },
                { value: "assist", label: "Asistencia (yo apruebo)" },
                { value: "read_only", label: "Solo reportes (sin ejecutar)" },
              ]}
            />
          )}

          {step === 5 && (
            <Select
              value={ctx.audience}
              onChange={(v: any) => setCtx({ ...ctx, audience: v })}
              options={[
                { value: "", label: "Alcance geográfico" },
                { value: "local", label: "Local" },
                { value: "country", label: "País" },
                { value: "latam", label: "LATAM" },
                { value: "global", label: "Global" },
              ]}
            />
          )}

          {step === 6 && (
            <Select
              value={ctx.competeOn}
              onChange={(v: any) => setCtx({ ...ctx, competeOn: v })}
              options={[
                { value: "", label: "¿En qué compiten?" },
                { value: "price", label: "Precio" },
                { value: "brand", label: "Marca" },
                { value: "service", label: "Servicio" },
                { value: "delivery", label: "Entrega" },
              ]}
            />
          )}

          {err && (
            <div className="rounded-lg border bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="flex justify-between pt-2">
            {step > 0 ? (
              <button className="rounded-lg border px-3 py-2 text-sm" onClick={prev}>
                Atrás
              </button>
            ) : <span />}

            {step < STEPS.length - 1 ? (
              <button className="rounded-lg bg-black text-white px-3 py-2 text-sm" onClick={next}>
                Siguiente
              </button>
            ) : (
              <button
                disabled={saving || missingProject}
                className="rounded-lg bg-black text-white px-3 py-2 text-sm disabled:opacity-60"
                onClick={finish}
              >
                {saving ? "Guardando…" : "Finalizar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const steps = [
  "Etapa del negocio",
  "Objetivo principal",
  "Presupuesto",
  "Experiencia Ads",
  "Competencia"
];

export default function OnboardingClient() {
  const sp = useSearchParams();
  const projectId = useMemo(() => sp.get("projectId") || "", [sp]);
  const [step, setStep] = useState(0);
  const [context, setContext] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  async function finish() {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/super-agent/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, context }),
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

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Configuración inicial</h1>
      <p className="text-sm text-muted-foreground">
        Este asistente define la estrategia inicial del agente.
      </p>

      <div className="text-sm text-muted-foreground">
        Paso {step + 1} de {steps.length}: {steps[step]}
      </div>

      {!projectId && (
        <div className="rounded-lg border bg-yellow-50 p-4 text-sm">
          Falta <b>projectId</b>. Volvé al dashboard y elegí un proyecto.
        </div>
      )}

      {step === 0 && (
        <select className="w-full border p-2 rounded bg-white"
          onChange={e => setContext({ ...context, stage: e.target.value })}>
          <option value="">¿Cuánto tiempo lleva tu tienda?</option>
          <option value="0_30">0–30 días</option>
          <option value="1_3m">1–3 meses</option>
          <option value="3_12m">3–12 meses</option>
          <option value="1y">1+ año</option>
        </select>
      )}

      {step === 1 && (
        <select className="w-full border p-2 rounded bg-white"
          onChange={e => setContext({ ...context, goal: e.target.value })}>
          <option value="">Objetivo principal</option>
          <option value="sales">Ventas</option>
          <option value="leads">Leads</option>
          <option value="traffic">Tráfico</option>
          <option value="branding">Branding</option>
        </select>
      )}

      {step === 2 && (
        <select className="w-full border p-2 rounded bg-white"
          onChange={e => setContext({ ...context, budgetMonthly: e.target.value })}>
          <option value="">Presupuesto mensual</option>
          <option value="lt_300">&lt; 300 USD</option>
          <option value="300_1000">300–1.000 USD</option>
          <option value="gt_1000">1.000+ USD</option>
        </select>
      )}

      {step === 3 && (
        <select className="w-full border p-2 rounded bg-white"
          onChange={e => setContext({ ...context, adsExperience: e.target.value })}>
          <option value="">Experiencia en Ads</option>
          <option value="none">Ninguna</option>
          <option value="basic">Básica</option>
          <option value="advanced">Avanzada</option>
        </select>
      )}

      {step === 4 && (
        <select className="w-full border p-2 rounded bg-white"
          onChange={e => setContext({ ...context, competeOn: e.target.value })}>
          <option value="">¿En qué compiten?</option>
          <option value="price">Precio</option>
          <option value="brand">Marca</option>
          <option value="service">Servicio</option>
          <option value="delivery">Entrega</option>
        </select>
      )}

      {err && (
        <div className="rounded-lg border bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="flex justify-between">
        {step > 0 && <button onClick={prev}>Atrás</button>}
        {step < steps.length - 1 && <button onClick={next}>Siguiente</button>}
        {step === steps.length - 1 && (
          <button
            disabled={saving || !projectId}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
            onClick={finish}
          >
            {saving ? "Guardando…" : "Finalizar"}
          </button>
        )}
      </div>
    </div>
  );
}

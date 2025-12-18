"use client";

import { useState } from "react";

const steps = [
  "Etapa del negocio",
  "Objetivo principal",
  "Presupuesto",
  "Experiencia Ads",
  "Competencia"
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [context, setContext] = useState<any>({});
  const projectId = "demo-project"; // luego lo sacás del router / store

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  async function finish() {
    await fetch("/api/super-agent/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, context }),
    });
    window.location.href = "/super-agent";
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Configuración inicial</h1>

      <div className="text-sm text-muted-foreground">
        Paso {step + 1} de {steps.length}: {steps[step]}
      </div>

      {step === 0 && (
        <select
          className="w-full border p-2 rounded"
          onChange={e => setContext({ ...context, stage: e.target.value })}
        >
          <option>¿Cuánto tiempo lleva tu tienda?</option>
          <option value="new">0–30 días</option>
          <option value="early">1–3 meses</option>
          <option value="growing">3–12 meses</option>
          <option value="mature">1+ año</option>
        </select>
      )}

      {step === 1 && (
        <select
          className="w-full border p-2 rounded"
          onChange={e => setContext({ ...context, goal: e.target.value })}
        >
          <option>Objetivo principal</option>
          <option value="sales">Ventas</option>
          <option value="leads">Leads</option>
          <option value="traffic">Tráfico</option>
          <option value="branding">Branding</option>
        </select>
      )}

      {step === 2 && (
        <select
          className="w-full border p-2 rounded"
          onChange={e => setContext({ ...context, budget: e.target.value })}
        >
          <option>Presupuesto mensual</option>
          <option value="low">&lt; 300 USD</option>
          <option value="mid">300–1.000 USD</option>
          <option value="high">1.000+ USD</option>
        </select>
      )}

      {step === 3 && (
        <select
          className="w-full border p-2 rounded"
          onChange={e => setContext({ ...context, adsExperience: e.target.value })}
        >
          <option>Experiencia en Ads</option>
          <option value="none">Ninguna</option>
          <option value="basic">Básica</option>
          <option value="advanced">Avanzada</option>
        </select>
      )}

      {step === 4 && (
        <select
          className="w-full border p-2 rounded"
          onChange={e => setContext({ ...context, competition: e.target.value })}
        >
          <option>Competencia</option>
          <option value="price">Precio</option>
          <option value="brand">Marca</option>
          <option value="service">Servicio</option>
        </select>
      )}

      <div className="flex justify-between">
        {step > 0 && <button onClick={prev}>Atrás</button>}
        {step < steps.length - 1 && <button onClick={next}>Siguiente</button>}
        {step === steps.length - 1 && (
          <button className="bg-black text-white px-4 py-2 rounded" onClick={finish}>
            Finalizar
          </button>
        )}
      </div>
    </div>
  );
}

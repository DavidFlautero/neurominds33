"use client";

import { useEffect, useMemo, useState } from "react";
import { CodeBlock } from "@/components/super-agent/CodeBlock";

type Project = { id: string; name: string; siteUrl: string; status: string; lastEventAt?: number | null };

const Steps = [
  "Bienvenida",
  "Proyecto",
  "Objetivo",
  "Historia",
  "Presupuesto",
  "Competencia",
  "Sync (Snippet)",
  "Scan inicial",
] as const;

function slugId(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 48) || `proj-${Date.now()}`;
}

export default function WizardPage() {
  const [step, setStep] = useState(0);

  const [name, setName] = useState("Demo Project");
  const [siteUrl, setSiteUrl] = useState("https://neuromind33.online");
  const [project, setProject] = useState<Project | null>(null);

  const [goal, setGoal] = useState<"ventas" | "leads" | "clicks">("ventas");
  const [experience, setExperience] = useState<"nueva" | "intermedia" | "pro">("nueva");
  const [budget, setBudget] = useState<"bajo" | "medio" | "alto">("bajo");
  const [competitors, setCompetitors] = useState<string>("");

  const [snippet, setSnippet] = useState<string>("");
  const [syncStatus, setSyncStatus] = useState<"created" | "synced" | "ready" | "unknown">("unknown");
  const [lastEventAt, setLastEventAt] = useState<number | null>(null);

  const projectId = useMemo(() => slugId(name), [name]);

  async function createProject() {
    const r = await fetch("/api/super-agent/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: projectId, name, siteUrl }),
    });
    const j = await r.json();
    if (j.ok) setProject(j.project);
  }

  async function generateSnippet() {
    // Usamos tu endpoint existente si ya lo tenés; si no, podés pegar el snippet manualmente.
    const r = await fetch("/api/super-agent/sync/snippet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: projectId, siteUrl }),
    });
    const j = await r.json();
    setSnippet(j.snippet || "");
  }

  async function pollStatus() {
    const r = await fetch(`/api/super-agent/sync/status?projectId=${encodeURIComponent(projectId)}`, { cache: "no-store" });
    const j = await r.json();
    setSyncStatus(j.status || "unknown");
    setLastEventAt(j.lastEventAt ?? null);
  }

  async function runScan() {
    const r = await fetch("/api/super-agent/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, url: siteUrl }),
    });
    const j = await r.json();
    if (j.ok) {
      alert(`Scan listo. Score: ${j.report?.summary?.score ?? "?"}. Se guardó como proposalId: ${j.proposalId}`);
    } else {
      alert(`Scan error: ${j.error || "unknown"}`);
    }
  }

  useEffect(() => {
    if (step === 6) {
      const t = setInterval(pollStatus, 2500);
      pollStatus();
      return () => clearInterval(t);
    }
  }, [step, projectId]);

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-xl">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest text-slate-400">Super Agent • Onboarding</div>
            <div className="mt-2 text-2xl font-semibold">Asistente de Marketing (Modo Agencia)</div>
            <div className="mt-2 text-slate-300">
              Flujo guiado, preguntas cerradas y decisiones con riesgos/resultados. Sin humo.
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {Steps.map((s, i) => (
              <div
                key={s}
                className={`rounded-full px-3 py-1 text-xs border ${
                  i === step
                    ? "border-slate-300 text-white"
                    : i < step
                    ? "border-slate-700 text-slate-300"
                    : "border-slate-800 text-slate-500"
                }`}
              >
                {i + 1}. {s}
              </div>
            ))}
          </div>

          {/* Step content */}
          {step === 0 && (
            <section className="space-y-4">
              <div className="text-lg font-medium">Bienvenido</div>
              <p className="text-slate-300">
                Te vamos a guiar como una agencia seria: primero contexto + sincronización, después diagnóstico, después plan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
                >
                  Empezar guiado
                </button>
                <button
                  onClick={() => setStep(6)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-800"
                >
                  Ir directo a Sync
                </button>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-4">
              <div className="text-lg font-medium">Proyecto</div>
              <div className="grid gap-3">
                <label className="text-sm text-slate-300">
                  Nombre del proyecto (identifica la tienda)
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                  />
                </label>
                <label className="text-sm text-slate-300">
                  URL del sitio (donde se instalará el snippet)
                  <input
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                  />
                </label>
                <div className="text-xs text-slate-400">ID técnico: {projectId}</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={async () => { await createProject(); setStep(2); }}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
                >
                  Crear proyecto y seguir
                </button>
                <button
                  onClick={() => setStep(0)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
                >
                  Atrás
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <div className="text-lg font-medium">Objetivo principal</div>
              <div className="grid gap-2">
                {[
                  { v: "ventas", t: "Maximizar ventas", d: "Optimiza para ROAS, conversión y ticket." },
                  { v: "leads", t: "Generar leads", d: "Optimiza para formularios, WhatsApp y follow-up." },
                  { v: "clicks", t: "Tráfico calificado", d: "Optimiza para CTR, intención y pruebas." },
                ].map((x) => (
                  <button
                    key={x.v}
                    onClick={() => setGoal(x.v as any)}
                    className={`text-left rounded-xl border px-4 py-3 ${
                      goal === x.v ? "border-slate-300 bg-slate-800/50" : "border-slate-800 hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="font-medium">{x.t}</div>
                    <div className="text-sm text-slate-300">{x.d}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  Siguiente
                </button>
                <button onClick={() => setStep(1)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
                  Atrás
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <div className="text-lg font-medium">Nivel de experiencia</div>
              <div className="grid gap-2">
                {[
                  { v: "nueva", t: "Primera vez con Ads", d: "Necesitás guía total + educación." },
                  { v: "intermedia", t: "Ya probé campañas", d: "Vamos a auditar y mejorar estructura." },
                  { v: "pro", t: "Tengo experiencia", d: "Nos enfocamos en optimización avanzada." },
                ].map((x) => (
                  <button
                    key={x.v}
                    onClick={() => setExperience(x.v as any)}
                    className={`text-left rounded-xl border px-4 py-3 ${
                      experience === x.v ? "border-slate-300 bg-slate-800/50" : "border-slate-800 hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="font-medium">{x.t}</div>
                    <div className="text-sm text-slate-300">{x.d}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  Siguiente
                </button>
                <button onClick={() => setStep(2)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
                  Atrás
                </button>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-4">
              <div className="text-lg font-medium">Presupuesto (rango)</div>
              <div className="grid gap-2">
                {[
                  { v: "bajo", t: "Bajo", d: "Estrategia conservadora. Validación rápida." },
                  { v: "medio", t: "Medio", d: "Testing + escalado por señales." },
                  { v: "alto", t: "Alto", d: "Ejecución agresiva con guardrails." },
                ].map((x) => (
                  <button
                    key={x.v}
                    onClick={() => setBudget(x.v as any)}
                    className={`text-left rounded-xl border px-4 py-3 ${
                      budget === x.v ? "border-slate-300 bg-slate-800/50" : "border-slate-800 hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="font-medium">{x.t}</div>
                    <div className="text-sm text-slate-300">{x.d}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(5)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  Siguiente
                </button>
                <button onClick={() => setStep(3)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
                  Atrás
                </button>
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="space-y-4">
              <div className="text-lg font-medium">Competencia</div>
              <p className="text-slate-300 text-sm">
                Pegá 1–5 URLs (una por línea). Esto se usa para “War Room” y mejores prácticas.
              </p>
              <textarea
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                className="h-28 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white"
                placeholder={"https://competidor1.com\nhttps://competidor2.com"}
              />
              <div className="flex gap-3">
                <button onClick={() => setStep(6)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  Siguiente: Sync
                </button>
                <button onClick={() => setStep(4)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
                  Atrás
                </button>
              </div>
            </section>
          )}

          {step === 6 && (
            <section className="space-y-4">
              <div className="text-lg font-medium">Sync (Snippet)</div>
              <p className="text-sm text-slate-300">
                Primero generá el snippet. Luego pegalo en tu web. Cuando empiecen a llegar eventos, se desbloquea el resto.
              </p>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm text-slate-300">
                    Estado: <span className="font-semibold text-white">{syncStatus}</span>
                    {lastEventAt ? <span className="text-slate-400"> • lastEventAt: {new Date(lastEventAt).toLocaleString()}</span> : null}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={createProject} className="rounded-xl border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">
                      Crear/Guardar proyecto
                    </button>
                    <button onClick={generateSnippet} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                      Generar snippet
                    </button>
                  </div>
                </div>
              </div>

              {snippet ? <CodeBlock code={snippet} /> : null}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(7)}
                  disabled={syncStatus !== "synced"}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                    syncStatus === "synced"
                      ? "bg-white text-slate-950 hover:bg-slate-200"
                      : "bg-slate-700 text-slate-300 cursor-not-allowed"
                  }`}
                >
                  Continuar (requiere synced)
                </button>
                <button onClick={() => setStep(5)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
                  Atrás
                </button>
              </div>
            </section>
          )}

          {step === 7 && (
            <section className="space-y-4">
              <div className="text-lg font-medium">Scan inicial</div>
              <p className="text-sm text-slate-300">
                Esto genera el primer impacto tipo agencia: SEO/UX/CRO + Ads readiness con razones.
              </p>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">
                <div><span className="text-slate-400">Proyecto:</span> {projectId}</div>
                <div><span className="text-slate-400">Sitio:</span> {siteUrl}</div>
                <div><span className="text-slate-400">Objetivo:</span> {goal}</div>
                <div><span className="text-slate-400">Experiencia:</span> {experience}</div>
                <div><span className="text-slate-400">Presupuesto:</span> {budget}</div>
              </div>

              <div className="flex gap-3">
                <button onClick={runScan} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  Ejecutar Scan v1
                </button>
                <button onClick={() => setStep(6)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
                  Atrás
                </button>
              </div>

              <div className="text-xs text-slate-400">
                Nota: el scan también genera una “proposal” y alimenta el módulo Learning automáticamente.
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

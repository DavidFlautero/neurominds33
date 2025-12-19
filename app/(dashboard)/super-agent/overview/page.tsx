"use client";

import { useMemo, useState } from "react";

type ScanFinding = {
  id: string;
  type: string;
  priority: "P0" | "P1" | "P2";
  title: string;
  advantage: string;
  risk: string;
  expectedResult: string;
  action: string;
  evidence?: string[];
};

type ScanResult = {
  ok: boolean;
  siteUrl: string;
  fetchedUrl?: string;
  httpStatus?: number;
  timingMs: number;
  scores: { seo: number; cro: number; ux: number; tech: number; overall: number };
  adsReadiness: { verdict: "APTO" | "NO_APTO" | "RIESGO"; reasons: string[]; score: number };
  findings: ScanFinding[];
  warnings?: string[];
};

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/80">
      {text}
    </span>
  );
}

function PriorityPill({ p }: { p: "P0" | "P1" | "P2" }) {
  const cls =
    p === "P0"
      ? "bg-red-500/15 border-red-400/30 text-red-200"
      : p === "P1"
      ? "bg-amber-500/15 border-amber-400/30 text-amber-200"
      : "bg-emerald-500/15 border-emerald-400/30 text-emerald-200";

  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${cls}`}>{p}</span>;
}

export default function OverviewPage() {
  const [committee, setCommittee] = useState<any>(null);
  const [committeeLoading, setCommitteeLoading] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verdictLabel = useMemo(() => {
    if (!result) return null;
    const v = result.adsReadiness.verdict;
    const cls =
      v === "APTO"
        ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-200"
        : v === "RIESGO"
        ? "bg-amber-500/15 border-amber-400/30 text-amber-200"
        : "bg-red-500/15 border-red-400/30 text-red-200";
    return <span className={`inline-flex rounded-full border px-2 py-1 text-xs ${cls}`}>Ads readiness: {v} ({result.adsReadiness.score}/100)</span>;
  }, [result]);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/super-agent/scan/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteUrl }),
      });
      const data = (await res.json()) as ScanResult;
      if (!res.ok || !data.ok) {
        throw new Error((data as any).error || "Scan falló");
      }
      setResult(data);
      setCommittee(null);
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Reporte de Auditoría (Scan v1)</h1>
              <p className="mt-1 max-w-2xl text-sm text-white/60">
                Diagnóstico rápido y accionable (SEO / CRO / UX / Ads Readiness). Esto es la primera impresión real de una agencia senior.
              </p>
            </div>
            <div className="flex gap-2">
              <Badge text="v1" />
              <Badge text="Heurístico + scoring" />
              <Badge text="Output accionable" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block text-xs text-white/70">URL del sitio a auditar</label>
              <input
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://tu-tienda.com"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/20"
              />
              {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
            </div>
            <button
              onClick={run}
              disabled={loading || !siteUrl}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15 disabled:opacity-50"
            >
              {loading ? "Escaneando…" : "Iniciar Scan"}
            </button>
          </div>
        </div>

        {result ? (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white/80">Score global</h3>
                  {verdictLabel}
                </div>
                <p className="mt-3 text-3xl font-semibold">{result.scores.overall}/100</p>
                <p className="mt-1 text-xs text-white/55">Tiempo: {result.timingMs}ms · HTTP: {result.httpStatus ?? "?"}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/70">
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2">SEO: {result.scores.seo}</div>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2">TECH: {result.scores.tech}</div>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2">UX: {result.scores.ux}</div>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2">CRO: {result.scores.cro}</div>
                </div>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold text-white/80">Ads readiness — razones</h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/70">
                  {result.adsReadiness.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                {result.warnings?.length ? (
                  <>
                    <h4 className="mt-4 text-xs font-semibold text-white/70">Advertencias</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-white/55">
                      {result.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-end justify-between">
                <h2 className="text-base font-semibold">Hallazgos (accionables)</h2>
                <p className="text-xs text-white/60">{result.findings.length} items</p>
              </div>

              <div className="mt-4 grid gap-4">
                {result.findings.map((x) => (
                  <div key={x.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <PriorityPill p={x.priority} />
                      <Badge text={x.type} />
                      <h3 className="ml-1 text-sm font-semibold">{x.title}</h3>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold text-white/70">Ventaja</p>
                        <p className="mt-1 text-sm text-white/80">{x.advantage}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold text-white/70">Riesgo</p>
                        <p className="mt-1 text-sm text-white/80">{x.risk}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold text-white/70">Resultado esperado</p>
                        <p className="mt-1 text-sm text-white/80">{x.expectedResult}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold text-white/70">Qué hay que cambiar</p>
                        <p className="mt-1 text-sm text-white/80">{x.action}</p>
                      </div>
                    </div>

                    {x.evidence?.length ? (
                      <div className="mt-3 text-xs text-white/55">
                        Evidencia: {x.evidence.join(" · ")}
                      </div>
                    ) : null}

                    <div className="mt-4 flex gap-2">
                      <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15">
                        Cotizar este cambio (próximo)
                      </button>
                      <button className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/5">
                        Marcar como revisado (próximo)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

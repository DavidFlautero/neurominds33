"use client";

import { useMemo, useState } from "react";

type SettingsForm = {
  projectId: string;
  siteUrl: string;
  goalsPrimary: string;
  goalsSecondary: string;
  monthlyBudgetUsd: number;
  dailyBudgetUsd: number;
  maxCACUsd: number;
  requiresApprovalAboveUsd: number;
  noPopups: boolean;
  noPricingChanges: boolean;
  tone: "aggressive" | "balanced" | "conservative";
};

export default function SuperAgentSettings() {
  const [form, setForm] = useState<SettingsForm>({
    projectId: "local",
    siteUrl: "https://example.com",
    goalsPrimary: "Maximizar ventas",
    goalsSecondary: "Mejorar CVR, AOV",
    monthlyBudgetUsd: 1000,
    dailyBudgetUsd: 50,
    maxCACUsd: 10,
    requiresApprovalAboveUsd: 25,
    noPopups: false,
    noPricingChanges: false,
    tone: "balanced",
  });

  const payload = useMemo(() => {
    return {
      projectId: form.projectId,
      siteUrl: form.siteUrl,
      goals: {
        primary: form.goalsPrimary,
        secondary: form.goalsSecondary
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
      },
      competitors: [],
      guardrails: {
        monthlyBudgetUsd: Number(form.monthlyBudgetUsd),
        dailyBudgetUsd: Number(form.dailyBudgetUsd),
        maxCACUsd: Number(form.maxCACUsd),
        requiresApprovalAboveUsd: Number(form.requiresApprovalAboveUsd),
      },
      preferences: {
        noPopups: form.noPopups,
        noPricingChanges: form.noPricingChanges,
        tone: form.tone,
      },
    };
  }, [form]);

  async function save() {
    // MVP: por ahora lo guardamos en localStorage. Luego lo conectamos a DB (Drizzle) + API.
    localStorage.setItem("nm_super_agent_settings", JSON.stringify(payload));
    alert("Guardado (localStorage). Luego lo conectamos a DB.");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-4 space-y-3">
        <div className="font-medium">Proyecto</div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <div className="text-xs text-slate-600 dark:text-slate-400">Project ID</div>
            <input
              className="w-full rounded-md border p-2"
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-slate-600 dark:text-slate-400">Site URL</div>
            <input
              className="w-full rounded-md border p-2"
              value={form.siteUrl}
              onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs text-slate-600 dark:text-slate-400">Objetivo primario</div>
            <input
              className="w-full rounded-md border p-2"
              value={form.goalsPrimary}
              onChange={(e) => setForm({ ...form, goalsPrimary: e.target.value })}
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs text-slate-600 dark:text-slate-400">Objetivos secundarios (coma)</div>
            <input
              className="w-full rounded-md border p-2"
              value={form.goalsSecondary}
              onChange={(e) => setForm({ ...form, goalsSecondary: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <div className="font-medium">Guardrails</div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <div className="text-xs text-slate-600 dark:text-slate-400">Budget mensual (USD)</div>
            <input
              type="number"
              className="w-full rounded-md border p-2"
              value={form.monthlyBudgetUsd}
              onChange={(e) => setForm({ ...form, monthlyBudgetUsd: Number(e.target.value) })}
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-slate-600 dark:text-slate-400">Budget diario (USD)</div>
            <input
              type="number"
              className="w-full rounded-md border p-2"
              value={form.dailyBudgetUsd}
              onChange={(e) => setForm({ ...form, dailyBudgetUsd: Number(e.target.value) })}
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-slate-600 dark:text-slate-400">CAC máximo (USD)</div>
            <input
              type="number"
              className="w-full rounded-md border p-2"
              value={form.maxCACUsd}
              onChange={(e) => setForm({ ...form, maxCACUsd: Number(e.target.value) })}
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-slate-600 dark:text-slate-400">Aprobación si gasto &gt; (USD)</div>
            <input
              type="number"
              className="w-full rounded-md border p-2"
              value={form.requiresApprovalAboveUsd}
              onChange={(e) => setForm({ ...form, requiresApprovalAboveUsd: Number(e.target.value) })}
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <div className="font-medium">Preferencias</div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.noPopups}
              onChange={(e) => setForm({ ...form, noPopups: e.target.checked })}
            />
            <span className="text-sm">No sugerir popups</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.noPricingChanges}
              onChange={(e) => setForm({ ...form, noPricingChanges: e.target.checked })}
            />
            <span className="text-sm">No sugerir cambios de pricing</span>
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs text-slate-600 dark:text-slate-400">Tono</div>
            <select
              className="w-full rounded-md border p-2"
              value={form.tone}
              onChange={(e) => setForm({ ...form, tone: e.target.value as SettingsForm["tone"] })}
            >
              <option value="aggressive">Aggressive</option>
              <option value="balanced">Balanced</option>
              <option value="conservative">Conservative</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="rounded-md bg-black text-white px-4 py-2" onClick={save}>
          Guardar
        </button>

        <button
          className="rounded-md border px-4 py-2"
          onClick={() => navigator.clipboard.writeText(JSON.stringify(payload, null, 2))}
        >
          Copiar JSON
        </button>
      </div>

      <pre className="text-xs rounded-xl border p-3 overflow-auto">{JSON.stringify(payload, null, 2)}</pre>
    </div>
  );
}

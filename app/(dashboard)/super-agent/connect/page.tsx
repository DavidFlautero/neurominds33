"use client";

import { useEffect, useState } from "react";

export default function ConnectPage() {
  const [projectId] = useState("demo-project");
  const [siteUrl, setSiteUrl] = useState("");
  const [snippet, setSnippet] = useState<string | null>(null);
  const [status, setStatus] = useState("idle");

  async function generateSnippet() {
    const res = await fetch("/api/super-agent/sync/snippet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, siteUrl }),
    });
    const json = await res.json();
    setSnippet(json.snippet);
  }

  async function checkStatus() {
    setStatus("syncing");
    const res = await fetch(`/api/super-agent/sync/status?projectId=${projectId}`);
    const json = await res.json();
    if (json.status === "synced") setStatus("ok");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold">Conectar tu sitio</h2>

      <input
        className="w-full border rounded-md p-2"
        placeholder="https://tusitio.com"
        value={siteUrl}
        onChange={(e) => setSiteUrl(e.target.value)}
      />

      <button onClick={generateSnippet} className="px-4 py-2 bg-black text-white rounded-md">
        Generar snippet
      </button>

      {snippet && (
        <pre className="bg-slate-900 text-white p-3 rounded-md text-xs overflow-auto">
          {snippet}
        </pre>
      )}

      {snippet && (
        <button onClick={checkStatus} className="px-4 py-2 border rounded-md">
          Iniciar sincronización
        </button>
      )}

      {status === "syncing" && <div>🟡 Sincronizando…</div>}
      {status === "ok" && <div>🟢 Sincronización completada</div>}
    </div>
  );
}

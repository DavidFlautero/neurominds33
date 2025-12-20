"use client";

import { useState } from "react";

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4">
      <button
        onClick={onCopy}
        className="absolute right-3 top-3 rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
      <pre className="overflow-auto text-xs leading-5 text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

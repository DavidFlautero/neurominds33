"use client";

import { useState } from "react";
import type { AgentResponsePayload } from "@/ia/agent-sales-config";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const STEPS: Array<AgentResponsePayload["step"]> = [
  "descubrimiento",
  "diagnostico",
  "propuesta",
  "cierre",
];

export function SalesAgentWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hola, soy el agente IA de NeuroMind33. Contame en pocas palabras de qué va tu negocio y qué querés mejorar (ventas, automatización, tienda online, etc.).",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentData, setAgentData] = useState<AgentResponsePayload | null>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error("Error en el agente IA");
      }

      const data: AgentResponsePayload = await res.json();
      setAgentData(data);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Se complicó un poco analizar eso. Probá contármelo de nuevo con otras palabras o más simple.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante tipo WhatsApp */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-6 right-6 z-40
          flex items-center gap-2
          rounded-full px-4 py-3
          shadow-xl
          bg-sky-500 text-white
          hover:bg-sky-600 hover:scale-[1.03]
          transition
        "
      >
        <i className="fa-solid fa-robot text-sm" />
        <span className="hidden sm:inline text-sm font-medium">
          Asesor IA
        </span>
      </button>

      {/* Overlay + panel lateral */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div
            className="
              h-full w-full max-w-3xl
              bg-slate-950 text-slate-50
              flex flex-col shadow-2xl
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div>
                <div className="text-[11px] uppercase text-sky-400 tracking-wide">
                  NeuroMind33 · Agente IA
                </div>
                <div className="text-sm font-semibold">
                  Diseñamos tu solución de software en tiempo real
                </div>
                <div className="text-[11px] text-slate-400">
                  Te hago preguntas concretas y te propongo un plan accionable.
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-slate-800 transition"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Cuerpo: chat + resumen */}
            <div className="flex-1 flex flex-col md:flex-row">
              {/* Columna chat */}
              <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-slate-800">
                <div className="flex-1 overflow-auto p-4 space-y-3">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-2xl px-3 py-2 text-sm
                          ${
                            m.role === "user"
                              ? "bg-sky-600 text-white"
                              : "bg-slate-800 text-slate-50"
                          }
                        `}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="text-[11px] text-slate-400">
                      Analizando tu caso y pensando propuestas…
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-slate-800 p-3">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Contame de tu negocio o qué querés mejorar…"
                      className="
                        flex-1 bg-slate-900 border border-slate-700
                        rounded-xl px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-sky-500
                      "
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading}
                      className="
                        rounded-xl px-4 py-2 text-sm font-medium
                        bg-sky-500 text-white
                        disabled:opacity-50
                      "
                    >
                      {loading ? "Analizando…" : "Enviar"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Columna resumen / funnel */}
              <div className="w-full md:w-80 p-4 flex flex-col gap-3 bg-slate-900/60">
                {/* Estado del proceso */}
                <div>
                  <div className="text-[11px] uppercase text-slate-400">
                    Estado del proceso
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                    {STEPS.map((step) => {
                      const active =
                        agentData?.step === step ||
                        (!agentData && step === "descubrimiento");
                      return (
                        <span
                          key={step}
                          className={`
                            px-2 py-1 rounded-full
                            ${
                              active
                                ? "bg-sky-500/90 text-white"
                                : "bg-slate-800 text-slate-300"
                            }
                          `}
                        >
                          {step}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Resumen del negocio */}
                <div className="border border-slate-800 rounded-xl p-3">
                  <div className="text-[11px] uppercase text-slate-400 mb-1">
                    Resumen del negocio (IA)
                  </div>
                  <div className="space-y-1 text-[12px] text-slate-200">
                    <p>
                      <span className="text-slate-400">Tipo:</span>{" "}
                      {agentData?.summary.tipoNegocio ?? "Pendiente"}
                    </p>
                    <p>
                      <span className="text-slate-400">Ubicación:</span>{" "}
                      {agentData?.summary.ubicacion ?? "Pendiente"}
                    </p>
                    <p>
                      <span className="text-slate-400">Facturación:</span>{" "}
                      {agentData?.summary.facturacionAprox ?? "Pendiente"}
                    </p>
                    <p>
                      <span className="text-slate-400">Dolor:</span>{" "}
                      {agentData?.summary.dolorPrincipal ?? "Pendiente"}
                    </p>
                  </div>
                </div>

                {/* Oportunidades */}
                <div className="border border-slate-800 rounded-xl p-3">
                  <div className="text-[11px] uppercase text-slate-400 mb-1">
                    Oportunidades detectadas
                  </div>
                  <ul className="list-disc list-inside text-[12px] text-slate-200 space-y-1">
                    {agentData?.summary.oportunidadesClave?.length
                      ? agentData.summary.oportunidadesClave.map((o, i) => (
                          <li key={i}>{o}</li>
                        ))
                      : (
                        <li>La IA está analizando tu caso…</li>
                        )}
                  </ul>
                </div>

                {/* Próximos pasos */}
                <div className="border border-slate-800 rounded-xl p-3">
                  <div className="text-[11px] uppercase text-slate-400 mb-1">
                    Próximos pasos sugeridos
                  </div>
                  <ul className="list-disc list-inside text-[12px] text-slate-200 space-y-1">
                    {agentData?.nextActions?.length
                      ? agentData.nextActions.map((a, i) => <li key={i}>{a}</li>)
                      : (
                        <li>
                          Seguí chateando y te propongo un plan concreto para tu negocio.
                        </li>
                        )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

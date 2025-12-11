"use client";

import React, { useState } from "react";
import { RobotAssistant, type RobotState } from "@/components/assistant/RobotAssistant";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
}

export function SalesAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Soy N33, el asistente IA de NeuroMind33. Contame de tu negocio y te propongo cómo podemos ayudarte con software, IA y automatización.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);

  const robotState: RobotState = hasError
    ? "error"
    : isSending
    ? "thinking"
    : messages.length > 1
    ? "answer"
    : "idle";

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    setHasError(false);

    try {
      const res = await fetch("/api/agent-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content: trimmed },
          ],
        }),
      });

      if (!res.ok) throw new Error("Error en la API del asistente");

      const data = await res.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.reply ??
          "Tengo una propuesta, pero no pude formatearla bien. Probá de nuevo.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setHasError(false);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Hubo un problema conectando con el modelo de IA. Probá de nuevo en unos segundos o hablá directo por WhatsApp.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setHasError(true);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      {/* Botón flotante Asesor IA */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed bottom-6 right-24 z-[9500]
          flex items-center gap-2
          rounded-full px-4 py-2.5
          bg-slate-900 text-slate-50
          shadow-xl shadow-sky-500/40
          border border-slate-700/60
          hover:bg-slate-800 hover:scale-[1.03]
          transition
        "
      >
        <span
          className="
            inline-flex items-center justify-center
            w-7 h-7 rounded-2xl
            bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500
          "
        >
          <i className="fa-solid fa-robot text-xs text-white" />
        </span>
        <span className="text-xs font-semibold tracking-wide">
          Asesor IA
        </span>
      </button>

      {/* Panel del Asesor IA */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-4 z-[9400]
            w-[360px] max-w-[95vw]
            rounded-3xl border border-slate-800
            bg-slate-950/95 backdrop-blur-xl
            shadow-[0_25px_80px_rgba(15,23,42,0.9)]
            flex flex-col
            transition-transform transition-opacity duration-200
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-800/80">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-100">
                Asesor IA de NeuroMind33
              </span>
              <span className="text-[11px] text-slate-400">
                Te ayudo a pensar tu proyecto y opciones de trabajo juntos.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="
                inline-flex items-center justify-center
                w-7 h-7 rounded-full
                bg-slate-900 hover:bg-slate-800
                border border-slate-700/70
                text-slate-300 hover:text-slate-100
                transition
              "
            >
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          </div>

          {/* Contenido */}
          <div className="flex flex-col px-4 pt-2 pb-3 h-[360px]">
            {/* Robot */}
            <RobotAssistant state={robotState} />

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mt-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`
                    max-w-[90%] rounded-2xl px-3 py-2 text-xs leading-relaxed
                    ${
                      m.role === "assistant"
                        ? "bg-slate-900/80 text-slate-100 border border-slate-700/80 self-start"
                        : "bg-sky-500 text-white self-end ml-auto"
                    }
                  `}
                >
                  {m.content}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="mt-2 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Contame de tu negocio, ideas o dudas..."
                className="
                  flex-1 rounded-2xl border border-slate-700/70
                  bg-slate-900/80 text-xs text-slate-100
                  px-3 py-2 outline-none
                  placeholder:text-slate-500
                  focus:border-sky-500
                "
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                className="
                  inline-flex items-center justify-center
                  rounded-2xl px-3 py-2
                  bg-sky-500 text-white text-xs font-semibold
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-sky-600 transition
                "
              >
                {isSending ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

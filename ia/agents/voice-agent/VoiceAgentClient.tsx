"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { VOICE_AGENT } from "./config";
import type { VoiceAgentMessage, VoiceAgentState } from "./types";
import { createSpeechRecognition, hasSpeechRecognition, speak, uid } from "./utils";

type AgentSalesMsg = { role: "user" | "assistant"; content: string };

// Tu API /api/agent-sales devuelve un JSON con fields tipo: { reply, step, summary, ... }
function pickAgentReply(data: any): string {
  return (
    data?.reply ||
    data?.text ||
    data?.message ||
    data?.output ||
    "Listo. ¿Qué necesitas exactamente?"
  );
}

export default function VoiceAgentClient() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<VoiceAgentState>("idle");
  const [messages, setMessages] = useState<VoiceAgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true); // TTS
  const [autoContinue, setAutoContinue] = useState(true);

  const personaName = VOICE_AGENT.displayName[VOICE_AGENT.persona];

  const recRef = useRef<any>(null);
  const listenTimeoutRef = useRef<any>(null);

  const canSTT = useMemo(() => hasSpeechRecognition(), []);
  const greetedRef = useRef(false);

  useEffect(() => {
    (window as any).__N33VoiceAgent = {
      open: () => {
        setOpen(true);
        setState((s) => (s === "idle" ? "ready" : s));
      },
      talk: () => {
        setOpen(true);
        setTimeout(() => startListening(), 150);
      },
      close: () => {
        stopListening();
        setOpen(false);
      },
    };

    return () => {
      try {
        delete (window as any).__N33VoiceAgent;
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pushMessage(role: "user" | "assistant", text: string) {
    setMessages((prev) => [...prev, { id: uid(role), role, text, ts: Date.now() }]);
  }

  function buildAgentSalesMessages(userText: string): AgentSalesMsg[] {
    // Convertimos tu historial a lo que tu API espera: { role, content }
    const history: AgentSalesMsg[] = messages
      .slice(-10)
      .map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

    // Añadimos el mensaje actual del user al final
    history.push({ role: "user", content: userText });

    return history;
  }

  async function callAgent(userText: string) {
    setState("thinking");

    const payload = {
      messages: buildAgentSalesMessages(userText),
    };

    const res = await fetch(VOICE_AGENT.apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Si falla, lee el error para que no quedes a ciegas
    if (!res.ok) {
      let detail = "";
      try {
        const j = await res.json();
        detail = j?.error ? ` (${j.error})` : "";
      } catch {}
      throw new Error(`API error ${res.status}${detail}`);
    }

    const data = await res.json();
    const reply = pickAgentReply(data);

    pushMessage("assistant", reply);

    if (voiceEnabled) {
      setState("speaking");
      await speak(reply, VOICE_AGENT.lang);
    }

    setState("ready");

    // Conversación fluida opcional
    if (autoContinue && canSTT) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = setTimeout(() => {
        startListening();
      }, 250);

      setTimeout(() => {
        stopListening();
      }, VOICE_AGENT.autoContinueSeconds * 1000);
    }
  }

  function stopListening() {
    try {
      const rec = recRef.current;
      if (rec) {
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        rec.stop();
      }
    } catch {}
    recRef.current = null;
    if (state === "listening") setState("ready");
  }

  function startListening() {
    if (!canSTT) {
      setOpen(true);
      setState("ready");
      pushMessage("assistant", "Este navegador no soporta reconocimiento de voz. Puedes escribir y funciona igual.");
      return;
    }

    if (recRef.current) return;

    setOpen(true);
    setState("listening");

    const rec = createSpeechRecognition(VOICE_AGENT.lang);
    recRef.current = rec;

    rec.onresult = async (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript?.trim?.() || "";
      stopListening();

      if (!transcript) {
        setState("ready");
        return;
      }

      pushMessage("user", transcript);

      try {
        await callAgent(transcript);
      } catch (e: any) {
        setState("error");
        pushMessage("assistant", `Hubo un error consultando la IA. ${e?.message || ""}`.trim());
        setState("ready");
      }
    };

    rec.onerror = () => {
      stopListening();
      setState("error");
      pushMessage("assistant", "No pude acceder al micrófono o el navegador bloqueó el reconocimiento.");
      setState("ready");
    };

    rec.onend = () => {
      if (recRef.current) stopListening();
    };

    try {
      rec.start();
    } catch {
      stopListening();
      setState("error");
      pushMessage("assistant", "No se pudo iniciar el reconocimiento de voz en este navegador.");
      setState("ready");
    }
  }

  async function greetOnce() {
    if (greetedRef.current) return;
    greetedRef.current = true;

    setOpen(true);
    setState("opening");
    pushMessage("assistant", `${personaName}: ${VOICE_AGENT.initialGreeting}`);

    if (voiceEnabled) {
      await speak(VOICE_AGENT.initialGreeting, VOICE_AGENT.lang);
    }
    setState("ready");
  }

  async function sendText(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");

    pushMessage("user", text);

    try {
      await callAgent(text);
    } catch (e: any) {
      setState("error");
      pushMessage("assistant", `Hubo un error consultando la IA. ${e?.message || ""}`.trim());
      setState("ready");
    }
  }

  const badge =
    state === "listening"
      ? "Escuchando..."
      : state === "thinking"
      ? "Pensando..."
      : state === "speaking"
      ? "Hablando..."
      : state === "error"
      ? "Error"
      : "Listo";

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => {
          if (!open) greetOnce();
          else setOpen(false);
          stopListening();
        }}
        className="fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full shadow-2xl bg-slate-900 text-white border border-white/10 flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition"
        aria-label={`Abrir agente ${personaName}`}
        title={`Agente ${personaName}`}
      >
        <span className="relative block h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_25px_rgba(168,85,247,0.55)]" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-950 text-white border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-950">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold">{personaName}</div>
                <div className="text-xs text-white/60">
                  {badge}
                  {!canSTT && " · Voz no disponible (usa texto)"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setOpen(false);
                }}
                className="text-white/70 hover:text-white transition"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => startListening()}
                disabled={!canSTT || state === "listening" || state === "thinking" || state === "speaking"}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/10 transition text-sm"
              >
                {state === "listening" ? "Escuchando..." : "Hablar"}
              </button>

              <button
                type="button"
                onClick={() => stopListening()}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition text-sm"
              >
                Pausar
              </button>

              <label className="ml-auto flex items-center gap-2 text-xs text-white/70 select-none">
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                />
                Voz
              </label>

              <label className="flex items-center gap-2 text-xs text-white/70 select-none">
                <input
                  type="checkbox"
                  checked={autoContinue}
                  onChange={(e) => setAutoContinue(e.target.checked)}
                  disabled={!canSTT}
                />
                Fluido
              </label>
            </div>
          </div>

          <div className="max-h-[320px] overflow-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-sm text-white/60">
                Toca <b>Hablar</b> o escribe. No arranca solo: queda profesional y estable en móvil.
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600"
                        : "bg-white/10"
                    }`}
                  >
                    {m.text}
                    <div className="mt-1 text-[10px] opacity-60">
                      {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendText} className="p-3 border-t border-white/10 bg-slate-950">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe aquí..."
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/25"
              />
              <button
                type="submit"
                disabled={!input.trim() || state === "thinking"}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 disabled:opacity-40 transition text-sm"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

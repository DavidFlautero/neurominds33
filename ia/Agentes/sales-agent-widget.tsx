"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type ChatRole = "user" | "assistant";
type ChatMsg = { role: ChatRole; content: string; ts: number };

type AgentPayload = {
  reply: string;
  step?: string;
  leadScore?: number;
  summary?: any;
  nextActions?: string[];
};

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

function getSpeechRecognitionCtor(): any | null {
  if (!isBrowser()) return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function pickSpanishVoice(voices: SpeechSynthesisVoice[], preference: "female" | "male") {
  const es = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("es"));
  if (!es.length) return null;

  // Heurísticas simples (no todos los navegadores traen nombres consistentes)
  const femaleHints = ["helena", "sabrina", "laura", "female", "mujer"];
  const maleHints = ["pablo", "jorge", "male", "hombre"];

  const pool = preference === "female" ? femaleHints : maleHints;

  const byName = es.find((v) => pool.some((h) => (v.name || "").toLowerCase().includes(h)));
  return byName || es[0];
}

export function SalesAgentWidget() {
  // UI
  const [open, setOpen] = useState(false);

  // Chat
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "Hola. Soy Roxane. ¿En qué puedo ayudarte hoy?",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorHint, setErrorHint] = useState<string | null>(null);

  // Voice
  const [voiceEnabled, setVoiceEnabled] = useState(false); // conversación continua
  const [voicePreference, setVoicePreference] = useState<"female" | "male">("female");
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "thinking" | "speaking" | "blocked" | "unsupported">("idle");

  const recogRef = useRef<any | null>(null);
  const restartingRef = useRef(false);
  const lastUserUtteranceRef = useRef<string>("");

  const panelRef = useRef<HTMLDivElement | null>(null);

  const voiceSupported = useMemo(() => !!getSpeechRecognitionCtor() && isBrowser(), []);

  // Autoscroll cuando llega mensaje
  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  function addMsg(role: ChatRole, content: string) {
    setMessages((prev) => [...prev, { role, content, ts: Date.now() }]);
  }

  async function callAgent(nextMessages: ChatMsg[]): Promise<AgentPayload> {
    const res = await fetch("/api/agent-sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Tu API espera {messages:[{role,content}]}
      body: JSON.stringify({
        messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Agent error ${res.status}: ${txt}`);
    }

    return (await res.json()) as AgentPayload;
  }

  async function handleUserText(text: string) {
    const clean = (text || "").trim();
    if (!clean || busy) return;

    setErrorHint(null);
    setBusy(true);

    const next = [...messages, { role: "user" as const, content: clean, ts: Date.now() }];
    setMessages(next);

    try {
      const payload = await callAgent(next);
      const reply = (payload?.reply || "").trim() || "Listo. ¿Qué más te gustaría ajustar?";
      addMsg("assistant", reply);

      // Si voz está activa: hablar y luego reanudar escucha
      if (voiceEnabled) {
        await speak(reply);
        safeRestartListening();
      }
    } catch (e: any) {
      console.error(e);
      addMsg("assistant", "Hubo un error consultando la IA. Intenta de nuevo.");
      setErrorHint(
        e?.message?.includes("GEMINI_API_KEY")
          ? "Parece faltar GEMINI_API_KEY/GEMINI_MODEL en Vercel."
          : "Revisá logs de Vercel y el endpoint /api/agent-sales."
      );
      // Si falla, no “loop infinito” de voz
      setVoiceStatus((s) => (s === "listening" ? "idle" : s));
    } finally {
      setBusy(false);
    }
  }

  function stopAllSpeech() {
    if (!isBrowser()) return;
    try {
      window.speechSynthesis?.cancel?.();
    } catch {}
  }

  async function speak(text: string) {
    if (!isBrowser() || !window.speechSynthesis) return;
    stopAllSpeech();

    const voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length) return resolve(v);

      // Algunos navegadores cargan voces async
      const on = () => {
        const vv = window.speechSynthesis.getVoices();
        resolve(vv || []);
        window.speechSynthesis.removeEventListener("voiceschanged", on);
      };
      window.speechSynthesis.addEventListener("voiceschanged", on);
      setTimeout(() => {
        const vv = window.speechSynthesis.getVoices();
        resolve(vv || []);
        window.speechSynthesis.removeEventListener("voiceschanged", on);
      }, 500);
    });

    const chosen = pickSpanishVoice(voices, voicePreference);

    await new Promise<void>((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "es-ES";
      u.rate = 1.02;
      u.pitch = voicePreference === "female" ? 1.05 : 0.98;
      u.volume = 1.0;
      if (chosen) u.voice = chosen;

      u.onstart = () => setVoiceStatus("speaking");
      u.onend = () => {
        setVoiceStatus("idle");
        resolve();
      };
      u.onerror = () => {
        setVoiceStatus("idle");
        resolve();
      };

      window.speechSynthesis.speak(u);
    });
  }

  function ensureRecognition() {
    if (!voiceSupported) return null;
    if (recogRef.current) return recogRef.current;

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return null;

    const r = new Ctor();
    r.continuous = true;
    r.interimResults = false;
    r.lang = "es-ES";

    r.onresult = async (event: any) => {
      try {
        const last = event.results?.[event.results.length - 1];
        const transcript = (last?.[0]?.transcript || "").trim();

        // Evitar duplicados por re-emisión
        if (!transcript) return;
        if (transcript === lastUserUtteranceRef.current) return;
        lastUserUtteranceRef.current = transcript;

        // Pausar escucha mientras procesamos
        try { r.stop(); } catch {}

        setVoiceStatus("thinking");
        await handleUserText(transcript);
      } catch (err) {
        console.error(err);
        safeRestartListening();
      }
    };

    r.onerror = (event: any) => {
      console.error("[voice] recognition error:", event?.error);
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        setVoiceStatus("blocked");
        setVoiceEnabled(false);
        addMsg("assistant", "No pude acceder al micrófono o el navegador bloqueó el reconocimiento.");
        return;
      }
      safeRestartListening();
    };

    r.onend = () => {
      // Si está activo, reintentar (pero controlado)
      if (!voiceEnabled) return;
      safeRestartListening();
    };

    recogRef.current = r;
    return r;
  }

  function startListeningFromUserGesture() {
    if (!voiceSupported) {
      setVoiceStatus("unsupported");
      addMsg("assistant", "Tu navegador no soporta reconocimiento de voz. Usá el chat.");
      return;
    }

    const r = ensureRecognition();
    if (!r) {
      setVoiceStatus("unsupported");
      addMsg("assistant", "No pude inicializar el reconocimiento de voz. Usá el chat.");
      return;
    }

    try {
      setVoiceStatus("listening");
      r.start();
    } catch (e) {
      // En algunos navegadores start() falla si ya está iniciado
      safeRestartListening();
    }
  }

  function safeRestartListening() {
    if (!voiceEnabled) return;
    if (!voiceSupported) return;

    if (restartingRef.current) return;
    restartingRef.current = true;

    setTimeout(() => {
      restartingRef.current = false;
      const r = ensureRecognition();
      if (!r) return;
      try {
        setVoiceStatus("listening");
        r.start();
      } catch {}
    }, 350);
  }

  function stopListening() {
    stopAllSpeech();
    const r = recogRef.current;
    if (r) {
      try { r.onresult = null; } catch {}
      try { r.onerror = null; } catch {}
      try { r.onend = null; } catch {}
      try { r.stop(); } catch {}
      recogRef.current = null;
    }
    setVoiceStatus("idle");
    lastUserUtteranceRef.current = "";
  }

  function onToggleOpen() {
    const nextOpen = !open;
    setOpen(nextOpen);

    // Requisito: activar voz SOLO por gesto del usuario (click)
    // Enfoque pedido: click en botón flotante => abre y activa voz
    if (nextOpen) {
      setVoiceEnabled(true);
      setErrorHint(null);
      setTimeout(() => startListeningFromUserGesture(), 50);
    }
  }

  function onToggleVoice() {
    const next = !voiceEnabled;
    setVoiceEnabled(next);

    if (next) {
      setErrorHint(null);
      // Debe arrancar por click (gesture)
      startListeningFromUserGesture();
    } else {
      stopListening();
    }
  }

  // Si el usuario cambia de “mujer/hombre” no tocamos historial, solo voz
  useEffect(() => {
    // si está hablando, no interrumpimos; aplica en la próxima respuesta
  }, [voicePreference]);

  // Si se apaga voz, cortar recognition
  useEffect(() => {
    if (!voiceEnabled) stopListening();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceEnabled]);

  const statusLabel =
    voiceStatus === "listening"
      ? "Escuchando…"
      : voiceStatus === "thinking"
      ? "Pensando…"
      : voiceStatus === "speaking"
      ? "Hablando…"
      : voiceStatus === "blocked"
      ? "Mic bloqueado"
      : voiceStatus === "unsupported"
      ? "Voz no soportada"
      : "Listo";

  return (
    <>
      {/* Botón flotante único */}
      <button
        onClick={onToggleOpen}
        className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full shadow-2xl bg-slate-900 text-white border border-white/10 hover:bg-slate-800 transition flex items-center justify-center"
        aria-label="Abrir agente"
        title="Roxane"
      >
        <span className="text-lg">R</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[60] w-[360px] max-w-[92vw] rounded-2xl overflow-hidden border border-white/10 bg-slate-950 text-white shadow-2xl">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-950">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold truncate">Roxane</div>
                  <span className="text-xs text-white/60">• {statusLabel}</span>
                </div>
                <div className="text-xs text-white/50">
                  Chat + Voz (misma conversación)
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Toggle voz */}
                <button
                  onClick={onToggleVoice}
                  className={`h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center transition ${
                    voiceEnabled ? "bg-emerald-600/20" : "bg-white/5 hover:bg-white/10"
                  }`}
                  title={voiceEnabled ? "Desactivar micrófono" : "Activar micrófono"}
                >
                  {voiceEnabled ? <span>🎙️</span> : <span>🎤</span>}
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
                  title="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Preferencia de voz */}
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="text-xs text-white/60">Voz:</div>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded-lg text-xs border border-white/10 transition ${
                    voicePreference === "female" ? "bg-violet-600/20" : "bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setVoicePreference("female")}
                  type="button"
                >
                  Mujer (Roxane)
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-xs border border-white/10 transition ${
                    voicePreference === "male" ? "bg-violet-600/20" : "bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setVoicePreference("male")}
                  type="button"
                >
                  Hombre (Cosmos)
                </button>
              </div>
            </div>

            {errorHint && (
              <div className="mt-2 text-xs text-amber-300/90">
                {errorHint}
              </div>
            )}
          </div>

          {/* Body */}
          <div ref={panelRef} className="max-h-[320px] overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => {
              const mine = m.role === "user";
              return (
                <div key={m.ts + "-" + i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm border ${
                      mine
                        ? "bg-violet-600/20 border-violet-500/20"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    <div className="mt-1 text-[11px] text-white/40">
                      {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <form
            className="p-3 border-t border-white/10 bg-slate-950 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleUserText(input);
              setInput("");
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí acá… (o hablá con el mic)"
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-violet-400/40"
              disabled={busy}
            />
            <button
              type="submit"
              className="rounded-xl px-3 py-2 text-sm bg-violet-600/30 border border-violet-500/20 hover:bg-violet-600/40 transition disabled:opacity-60"
              disabled={busy || !input.trim()}
              title="Enviar"
            >
              {busy ? "…" : "Enviar"}
            </button>
          </form>

          <div className="px-3 pb-3 text-[11px] text-white/40">
            Tip: si minimizás el panel, la voz puede seguir activa mientras no la apagues.
          </div>
        </div>
      )}
    </>
  );
}

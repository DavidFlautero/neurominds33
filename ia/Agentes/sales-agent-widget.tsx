"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { RobotAssistant, type RobotState } from "@/components/assistant/RobotAssistant";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
}

type VoiceStatus = "off" | "starting" | "listening" | "speaking" | "error";

function getSpeechRecognition(): any | null {
  // Chrome / Edge / Android (webkitSpeechRecognition)
  // Firefox/Safari: normalmente no soporta SpeechRecognition
  // @ts-ignore
  return typeof window !== "undefined"
    ? // @ts-ignore
      window.SpeechRecognition || // @ts-ignore
      window.webkitSpeechRecognition || null
    : null;
}

function pickBestSpanishFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();

  // Heurística: preferir voces ES con nombres comunes femeninos (varía por SO/navegador)
  const preferred = voices.find(
    (v) =>
      v.lang?.toLowerCase().startsWith("es") &&
      /female|mujer|helena|laura|luciana|sofia|catalina|paulina|roxane/i.test(v.name)
  );

  const anyEs = voices.find((v) => v.lang?.toLowerCase().startsWith("es")) ?? null;
  return preferred ?? anyEs;
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

  // ---- VOZ (integrada, sin UI nueva) ----
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("off");
  const greetedRef = useRef(false);

  const recognitionRef = useRef<any | null>(null);
  const isMountedRef = useRef(true);
  const speakingRef = useRef(false);
  const lastHeardAtRef = useRef<number>(0);

  const robotState: RobotState = hasError
    ? "error"
    : isSending
    ? "thinking"
    : messages.length > 1
    ? "answer"
    : "idle";

  const canUseVoice = useMemo(() => {
    if (typeof window === "undefined") return false;
    const Rec = getSpeechRecognition();
    const hasTTS = "speechSynthesis" in window;
    return Boolean(Rec && hasTTS);
  }, []);

  function stopRecognition() {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop?.();
      }
    } catch {}
    recognitionRef.current = null;
  }

  function speak(text: string) {
    if (!voiceEnabled) return;

    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "es-ES";
      utter.rate = 1.0;
      utter.pitch = 1.1;
      utter.volume = 1.0;

      const voice = pickBestSpanishFemaleVoice();
      if (voice) utter.voice = voice;

      utter.onstart = () => {
        speakingRef.current = true;
        if (isMountedRef.current) setVoiceStatus("speaking");
      };

      utter.onend = () => {
        speakingRef.current = false;
        if (isMountedRef.current && voiceEnabled) {
          // Al terminar de hablar, reanudamos escucha si está habilitada
          setVoiceStatus("listening");
          startRecognition(); // safe re-start
        }
      };

      utter.onerror = () => {
        speakingRef.current = false;
        if (isMountedRef.current) setVoiceStatus("error");
      };

      window.speechSynthesis.speak(utter);
    } catch {
      setVoiceStatus("error");
    }
  }

  function startRecognition() {
    if (!voiceEnabled) return;
    if (!canUseVoice) {
      setVoiceStatus("error");
      return;
    }
    if (speakingRef.current) return; // no escuchamos mientras hablamos

    const Rec = getSpeechRecognition();
    if (!Rec) {
      setVoiceStatus("error");
      return;
    }

    // Si ya hay una instancia, evitamos duplicados
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start?.();
        setVoiceStatus("listening");
        return;
      } catch {
        // si falla, recreamos
        stopRecognition();
      }
    }

    try {
      const rec = new Rec();
      rec.lang = "es-ES";
      rec.continuous = true;
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onresult = async (event: any) => {
        // Evitar dobles disparos seguidos
        const now = Date.now();
        if (now - lastHeardAtRef.current < 800) return;
        lastHeardAtRef.current = now;

        const last = event.results?.[event.results.length - 1];
        const transcript = (last?.[0]?.transcript ?? "").trim();
        if (!transcript) return;

        // Pausamos reconocimiento mientras enviamos y mientras el TTS habla
        stopRecognition();
        if (!isMountedRef.current) return;

        // Enviar como si el usuario lo hubiera escrito
        await handleSend(transcript, { fromVoice: true });
      };

      rec.onerror = () => {
        if (!isMountedRef.current) return;
        setVoiceStatus("error");
      };

      rec.onend = () => {
        // Chrome corta a veces. Si voz sigue activa y no estamos hablando, relanzamos.
        if (!isMountedRef.current) return;
        if (voiceEnabled && !speakingRef.current) {
          try {
            rec.start?.();
            setVoiceStatus("listening");
          } catch {
            // Ignorar
          }
        }
      };

      recognitionRef.current = rec;
      rec.start?.();
      setVoiceStatus("listening");
    } catch {
      setVoiceStatus("error");
    }
  }

  async function enableVoiceAndStart() {
    if (!canUseVoice) {
      setVoiceStatus("error");
      return;
    }

    setVoiceEnabled(true);
    setVoiceStatus("starting");

    // Forzar carga de voces (algunos navegadores la cargan async)
    try {
      window.speechSynthesis.getVoices();
    } catch {}

    // Pedir permiso mic en interacción del usuario (este click)
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setVoiceStatus("error");
      setVoiceEnabled(false);
      return;
    }

    // Saludo hablado una sola vez por sesión abierta
    if (!greetedRef.current) {
      greetedRef.current = true;
      speak("Hola. ¿En qué puedo ayudarte hoy?");
      // speak() al terminar re-lanza startRecognition()
      return;
    }

    startRecognition();
  }

  function disableVoice() {
    setVoiceEnabled(false);
    setVoiceStatus("off");
    try {
      window.speechSynthesis?.cancel?.();
    } catch {}
    stopRecognition();
  }

  async function handleSend(textOverride?: string, opts?: { fromVoice?: boolean }) {
    const trimmed = (textOverride ?? input).trim();
    if (!trimmed || isSending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    // Nota: usamos el snapshot actual para construir el payload
    const nextMessagesForPayload = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: trimmed },
    ];

    setMessages((prev) => [...prev, userMessage]);
    if (!opts?.fromVoice) setInput("");
    setIsSending(true);
    setHasError(false);

    try {
      const res = await fetch("/api/agent-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessagesForPayload }),
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

      // Hablar la respuesta si voz está activa
      if (voiceEnabled) {
        // Cortamos escucha antes del TTS para evitar que capture su propia voz
        stopRecognition();
        speak(assistantMessage.content);
      }
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

      if (voiceEnabled) {
        stopRecognition();
        speak("Hubo un error consultando la IA. Intenta de nuevo.");
      }
    } finally {
      setIsSending(false);

      // Si voz activa y no estamos hablando, reanudamos escucha
      if (voiceEnabled && !speakingRef.current) {
        startRecognition();
      }
    }
  }

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      try {
        window.speechSynthesis?.cancel?.();
      } catch {}
      stopRecognition();
    };
  }, []);

  return (
    <>
      {/* Botón flotante Asesor IA (MISMO UI) */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev;

            // Activar voz SOLO al abrir (si el navegador soporta)
            // Esto ocurre dentro del mismo click (requisito para permisos)
            if (next && canUseVoice) {
              enableVoiceAndStart();
            }

            // Si cierra el panel, NO apagamos voz automáticamente (chat puede minimizarse y seguir hablando)
            // El usuario controla con el icono de micrófono.
            return next;
          });
        }}
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
        <span className="text-xs font-semibold tracking-wide">Asesor IA</span>
      </button>

      {/* Panel del Asesor IA (MISMO UI) */}
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

            <div className="flex items-center gap-2">
              {/* Mic toggle (chico y profesional, sin romper UI) */}
              <button
                type="button"
                title={
                  !canUseVoice
                    ? "Voz no disponible en este navegador"
                    : voiceEnabled
                    ? "Desactivar voz"
                    : "Activar voz"
                }
                onClick={async () => {
                  if (!canUseVoice) return;

                  if (voiceEnabled) {
                    disableVoice();
                    return;
                  }

                  // Activación manual con permiso mic
                  await enableVoiceAndStart();
                }}
                className={`
                  inline-flex items-center justify-center
                  w-7 h-7 rounded-full
                  border border-slate-700/70
                  transition
                  ${
                    !canUseVoice
                      ? "bg-slate-900 text-slate-600 cursor-not-allowed"
                      : voiceEnabled
                      ? "bg-sky-500 text-white hover:bg-sky-600"
                      : "bg-slate-900 text-slate-300 hover:text-slate-100 hover:bg-slate-800"
                  }
                `}
              >
                <i
                  className={`fa-solid ${
                    voiceEnabled ? "fa-microphone" : "fa-microphone-slash"
                  } text-xs`}
                />
              </button>

              {/* Close */}
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
          </div>

          {/* Contenido */}
          <div className="flex flex-col px-4 pt-2 pb-3 h-[360px]">
            {/* Robot */}
            <RobotAssistant state={robotState} />

            {/* Indicador de voz (sutil, sin UI nueva) */}
            {voiceEnabled && (
              <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    voiceStatus === "listening"
                      ? "bg-emerald-400 animate-pulse"
                      : voiceStatus === "speaking"
                      ? "bg-sky-400 animate-pulse"
                      : voiceStatus === "starting"
                      ? "bg-yellow-400 animate-pulse"
                      : voiceStatus === "error"
                      ? "bg-red-400"
                      : "bg-slate-600"
                  }`}
                />
                <span>
                  {voiceStatus === "starting"
                    ? "Activando voz…"
                    : voiceStatus === "listening"
                    ? "Voz activa: escuchando"
                    : voiceStatus === "speaking"
                    ? "Voz activa: hablando"
                    : voiceStatus === "error"
                    ? "No pude acceder al micrófono o el navegador bloqueó la voz"
                    : "Voz desactivada"}
                </span>
              </div>
            )}

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
                placeholder="Contame de tu negocio, ideas o dudas."
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
                onClick={() => handleSend()}
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

"use client";

import { useEffect, useRef } from "react";
import { createRecognition, isVoiceSupported, speak, type VoiceStatus } from "./voice-client";

type Props = {
  enabled: boolean;                 // si el mic está ON
  active: boolean;                  // si el panel está abierto (user gesture)
  greeting: string;                 // saludo al abrir
  voicePreference: "female" | "male";
  setStatus: (s: VoiceStatus) => void;

  // integración con tu UI existente
  onUserText: (text: string) => Promise<void>;   // tu función actual de "enviar mensaje"
  onAssistantSpoken?: () => void;                // opcional: cuando termina de hablar
};

export function VoiceLayer({
  enabled,
  active,
  greeting,
  voicePreference,
  setStatus,
  onUserText,
  onAssistantSpoken,
}: Props) {
  const recRef = useRef<any | null>(null);
  const restarting = useRef(false);

  // start/stop recognition
  const start = () => {
    if (!enabled || !active) return;
    if (!isVoiceSupported()) {
      setStatus("unsupported");
      return;
    }
    if (!recRef.current) {
      recRef.current = createRecognition({
        lang: "es-ES",
        onText: async (text) => {
          try { recRef.current?.stop?.(); } catch {}
          setStatus("thinking");
          await onUserText(text);
          // el widget hablará la respuesta si tú llamas speak ahí;
          // si NO, aquí no forzamos nada para no romper tu UI.
          safeRestart();
        },
        onError: (kind) => {
          if (kind === "blocked") {
            setStatus("blocked");
          } else {
            safeRestart();
          }
        },
        onEnd: () => {
          safeRestart();
        },
      });
    }
    try {
      setStatus("listening");
      recRef.current.start();
    } catch {
      safeRestart();
    }
  };

  const stop = () => {
    try { window.speechSynthesis?.cancel?.(); } catch {}
    try { recRef.current?.stop?.(); } catch {}
    recRef.current = null;
    setStatus("idle");
  };

  const safeRestart = () => {
    if (!enabled || !active) return;
    if (restarting.current) return;
    restarting.current = true;
    setTimeout(() => {
      restarting.current = false;
      start();
    }, 350);
  };

  // Cuando abres el panel (user gesture), saluda por voz y arranca escucha
  useEffect(() => {
    if (!active) return;
    if (!enabled) return;

    (async () => {
      if (!isVoiceSupported()) {
        setStatus("unsupported");
        return;
      }
      setStatus("speaking");
      await speak(greeting, voicePreference);
      setStatus("idle");
      onAssistantSpoken?.();
      start();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // si apagas mic, cortar todo
  useEffect(() => {
    if (!enabled) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // cleanup
  useEffect(() => () => stop(), []);

  return null;
}

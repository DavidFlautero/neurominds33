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
  const start = async () => {
    console.log("VoiceLayer: start llamado", { enabled, active, recRef: !!recRef.current });
    
    if (!enabled || !active) {
      console.log("VoiceLayer: no se inicia: enabled=", enabled, "active=", active);
      return;
    }
    
    if (!isVoiceSupported()) {
      console.log("VoiceLayer: voice no soportado");
      setStatus("unsupported");
      return;
    }
    
    // Intentar obtener permiso de micrófono primero
    try {
      console.log("VoiceLayer: solicitando permiso de micrófono");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      // Detener el stream inmediatamente (solo necesitamos el permiso)
      stream.getTracks().forEach(track => {
        track.stop();
        console.log("VoiceLayer: track detenido");
      });
      
      console.log("VoiceLayer: permiso de micrófono otorgado");
    } catch (error) {
      console.error("VoiceLayer: Error al solicitar permiso de micrófono:", error);
      setStatus("blocked");
      return;
    }
    
    // Crear reconocimiento si no existe
    if (!recRef.current) {
      console.log("VoiceLayer: creando nuevo reconocimiento");
      recRef.current = createRecognition({
        lang: "es-ES",
        onText: async (text) => {
          console.log("VoiceLayer: texto reconocido:", text);
          try { recRef.current?.stop?.(); } catch {}
          setStatus("thinking");
          await onUserText(text);
          safeRestart();
        },
        onError: (kind, raw) => {
          console.error("VoiceLayer: error en reconocimiento:", kind, raw);
          if (kind === "blocked") {
            setStatus("blocked");
          } else {
            safeRestart();
          }
        },
        onEnd: () => {
          console.log("VoiceLayer: reconocimiento terminado");
          safeRestart();
        },
      });
    }
    
    // Iniciar reconocimiento
    try {
      console.log("VoiceLayer: iniciando reconocimiento");
      setStatus("listening");
      recRef.current.start();
    } catch (error) {
      console.error("VoiceLayer: error al iniciar reconocimiento:", error);
      safeRestart();
    }
  };

  const stop = () => {
    console.log("VoiceLayer: stop llamado");
    try { window.speechSynthesis?.cancel?.(); } catch {}
    try { recRef.current?.stop?.(); } catch {}
    recRef.current = null;
    setStatus("idle");
  };

  const safeRestart = () => {
    console.log("VoiceLayer: safeRestart llamado");
    if (!enabled || !active) {
      console.log("VoiceLayer: no restart - enabled:", enabled, "active:", active);
      return;
    }
    if (restarting.current) {
      console.log("VoiceLayer: ya está reiniciando");
      return;
    }
    restarting.current = true;
    console.log("VoiceLayer: programando reinicio en 350ms");
    setTimeout(() => {
      restarting.current = false;
      console.log("VoiceLayer: ejecutando reinicio");
      start();
    }, 350);
  };

  // Efecto principal que maneja active y enabled
  useEffect(() => {
    if (!active || !enabled) {
      stop();
      return;
    }

    (async () => {
      if (!isVoiceSupported()) {
        setStatus("unsupported");
        return;
      }
      
      // Esperar un momento para asegurar que el DOM esté listo
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setStatus("speaking");
      await speak(greeting, voicePreference);
      setStatus("idle");
      onAssistantSpoken?.();
      
      // Iniciar reconocimiento después del saludo
      await new Promise(resolve => setTimeout(resolve, 300));
      start();
    })();

    return () => {
      stop();
    };
  }, [active, enabled, greeting, voicePreference, onAssistantSpoken, setStatus]);

  // cleanup
  useEffect(() => () => stop(), []);

  return null;
}

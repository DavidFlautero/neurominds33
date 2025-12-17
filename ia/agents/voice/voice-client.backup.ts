"use client";

export type VoiceStatus = "idle" | "listening" | "thinking" | "speaking" | "blocked" | "unsupported";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export function isVoiceSupported() {
  if (typeof window === "undefined") return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createRecognition(opts: {
  lang?: string;
  onText: (text: string) => void;
  onError: (kind: "blocked" | "other", raw?: any) => void;
  onEnd: () => void;
}) {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) return null;

  const r = new Ctor();
  r.lang = opts.lang || "es-ES";
  r.continuous = true;
  r.interimResults = false;

  r.onresult = (event: any) => {
    const last = event.results?.[event.results.length - 1];
    const text = (last?.[0]?.transcript || "").trim();
    if (text) opts.onText(text);
  };

  r.onerror = (event: any) => {
    const err = event?.error;
    if (err === "not-allowed" || err === "service-not-allowed") {
      opts.onError("blocked", event);
    } else {
      opts.onError("other", event);
    }
  };

  r.onend = () => opts.onEnd();

  return r;
}

export async function speak(text: string, voicePreference: "female" | "male" = "female") {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  // esperar voces (algunos navegadores las cargan async)
  const voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const v = window.speechSynthesis.getVoices();
    if (v?.length) return resolve(v);
    const on = () => {
      resolve(window.speechSynthesis.getVoices() || []);
      window.speechSynthesis.removeEventListener("voiceschanged", on);
    };
    window.speechSynthesis.addEventListener("voiceschanged", on);
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices() || []);
      window.speechSynthesis.removeEventListener("voiceschanged", on);
    }, 400);
  });

  const es = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("es"));
  const femaleHints = ["helena", "sabrina", "laura", "female"];
  const maleHints = ["pablo", "jorge", "male"];
  const hints = voicePreference === "female" ? femaleHints : maleHints;

  const chosen =
    es.find((v) => hints.some((h) => (v.name || "").toLowerCase().includes(h))) || es[0] || null;

  await new Promise<void>((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    u.rate = 1.02;
    u.pitch = voicePreference === "female" ? 1.05 : 0.98;
    u.volume = 1.0;
    if (chosen) u.voice = chosen;

    u.onend = () => resolve();
    u.onerror = () => resolve();

    window.speechSynthesis.speak(u);
  });
}

export function uid(prefix = "m") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function hasSpeechRecognition(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

export function createSpeechRecognition(lang: string) {
  const SR =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = lang;
  rec.continuous = false; // push-to-talk => estable
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  return rec;
}

export function hasSpeechSynthesis(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function speak(text: string, lang: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      if (!hasSpeechSynthesis()) return resolve();

      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;

      u.onend = () => resolve();
      u.onerror = () => resolve(); // no rompas UX por TTS

      window.speechSynthesis.speak(u);
    } catch (e) {
      resolve();
    }
  });
}

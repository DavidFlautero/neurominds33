export type VoicePersona = "roxane" | "cosmos";

export const VOICE_AGENT = {
  persona: "roxane" as VoicePersona, // <- cambia a "cosmos" si quieres
  displayName: {
    roxane: "Roxane",
    cosmos: "Cosmos",
  },
  // Endpoints (mantén agent-sales como dijiste)
  apiEndpoint: "/api/agent-sales",

  // Idioma (puedes cambiar a es-AR si quieres)
  lang: "es-ES",

  // Modo conversación: después de responder, puede re-abrir mic automáticamente
  autoContinueSeconds: 8,

  // UX
  initialGreeting: "Hola. ¿En qué puedo ayudarte hoy?",
};

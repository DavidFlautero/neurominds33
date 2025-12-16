export type VoiceAgentState =
  | "idle"
  | "opening"
  | "ready"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

export type MessageRole = "user" | "assistant";

export type VoiceAgentMessage = {
  id: string;
  role: MessageRole;

  text: string;
  ts: number;
};

export type AgentSalesRequest = {
  message: string;
  // opcional: si tu API soporta contexto, puedes incluirlo
  context?: {
    channel?: "voice" | "text";
    history?: { role: MessageRole; text: string }[];
  };
};

export type AgentSalesResponse = {
  text?: string;
  message?: string;
  output?: string;
  // cualquier otro campo que tu API devuelva
};

"use client";

import React from "react";

export type RobotState = "idle" | "listening" | "thinking" | "answer" | "error";

interface RobotAssistantProps {
  state: RobotState;
}

const stateLabel: Record<RobotState, string> = {
  idle: "Listo para ayudarte.",
  listening: "Te escucho...",
  thinking: "Analizando tu negocio...",
  answer: "Tengo una propuesta para vos.",
  error: "Hubo un problema, probemos de nuevo.",
};

export function RobotAssistant({ state }: RobotAssistantProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-3 py-2 mb-3">
      {/* Cabeza / avatar del robot */}
      <div
        className="
          relative flex items-center justify-center
          w-10 h-10 rounded-2xl
          bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500
          shadow-lg shadow-sky-500/30
        "
      >
        <div className="w-7 h-4 rounded-full bg-slate-950 flex items-center justify-center">
          <div className="w-5 h-1.5 rounded-full bg-sky-400/80" />
        </div>
        <div className="absolute -bottom-1 w-4 h-2 rounded-b-full bg-slate-900" />
      </div>

      {/* Nombre y estado */}
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-100 tracking-wide">
          N33 · Asistente IA
        </span>
        <span className="text-[11px] text-slate-400">
          {stateLabel[state]}
        </span>
      </div>
    </div>
  );
}

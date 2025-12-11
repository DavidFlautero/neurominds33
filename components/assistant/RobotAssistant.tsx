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
  const isActive = state === "thinking" || state === "listening";
  const isAnswer = state === "answer";
  const isError = state === "error";

  const wrapperBorder =
    isError
      ? "border-rose-500/70 bg-rose-950/40"
      : isActive
      ? "border-sky-500/70 bg-slate-900/80"
      : "border-slate-700/60 bg-slate-900/70";

  const subtitleColor = isError
    ? "text-rose-300"
    : isAnswer
    ? "text-emerald-300"
    : "text-slate-400";

  const avatarGradient = isError
    ? "from-rose-500 via-red-500 to-amber-400"
    : isAnswer
    ? "from-emerald-400 via-sky-500 to-indigo-500"
    : "from-sky-500 via-indigo-500 to-purple-500";

  const avatarShadow = isError
    ? "shadow-rose-500/40"
    : isActive
    ? "shadow-sky-400/60"
    : "shadow-sky-500/30";

  const avatarAnimation = isActive
    ? "animate-pulse"
    : "";

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-3 py-2 mb-3 transition-colors ${wrapperBorder}`}
    >
      {/* Cabeza / avatar del robot */}
      <div
        className={`
          relative flex items-center justify-center
          w-10 h-10 rounded-2xl
          bg-gradient-to-br ${avatarGradient}
          shadow-lg ${avatarShadow}
          ${avatarAnimation}
        `}
      >
        {/* Visor / ojos */}
        <div className="w-7 h-4 rounded-full bg-slate-950 flex items-center justify-center">
          <div
            className={`
              w-5 h-1.5 rounded-full
              ${isError ? "bg-rose-300/90" : isAnswer ? "bg-emerald-300/90" : "bg-sky-400/80"}
            `}
          />
        </div>
        {/* Base del cuello */}
        <div className="absolute -bottom-1 w-4 h-2 rounded-b-full bg-slate-900" />
      </div>

      {/* Nombre y estado */}
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-100 tracking-wide">
          N33 · Asistente IA
        </span>
        <span className={`text-[11px] ${subtitleColor}`}>
          {stateLabel[state]}
        </span>
      </div>
    </div>
  );
}

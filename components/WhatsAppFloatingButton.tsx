"use client";

import React from "react";

const WHATSAPP_URL =
  "https://wa.me/5491122334455?text=Hola%20NeuroMind33,%20quiero%20hablar%20sobre%20software%20e%20IA"; // TODO: cambiá por tu número real

export function WhatsAppFloatingButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.open(WHATSAPP_URL, "_blank");
      }}
      className="
        fixed bottom-6 right-6 z-[9000]
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-emerald-500
        shadow-xl shadow-emerald-500/30
        hover:bg-emerald-600 hover:scale-105
        transition
      "
      aria-label="Hablar por WhatsApp"
    >
      <i className="fa-brands fa-whatsapp text-2xl text-white" />
    </button>
  );
}

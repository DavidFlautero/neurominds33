"use client";

import { useState } from "react";

export default function ContextPage() {
  const [done, setDone] = useState(false);

  function submit() {
    setDone(true);
  }

  if (done) {
    return <div>🧠 Contexto guardado. Ahora podemos crear tu primer plan.</div>;
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold">Contanos sobre tu negocio</h2>

      <select className="w-full border p-2 rounded">
        <option>Web nueva</option>
        <option>En crecimiento</option>
        <option>Consolidada</option>
      </select>

      <select className="w-full border p-2 rounded">
        <option>Primera vez en Ads</option>
        <option>Tengo experiencia</option>
        <option>Quiero control total</option>
      </select>

      <input className="w-full border p-2 rounded" placeholder="Presupuesto mensual (USD)" />

      <button onClick={submit} className="px-4 py-2 bg-black text-white rounded-md">
        Guardar contexto
      </button>
    </div>
  );
}

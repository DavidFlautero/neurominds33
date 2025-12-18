import { Suspense } from "react";
import ScansClient from "./ScansClient";

export default function ScansPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando Sync…</div>}>
      <ScansClient />
    </Suspense>
  );
}

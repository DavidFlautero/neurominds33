import { Suspense } from "react";
import OnboardingClient from "./OnboardingClient";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando wizard…</div>}>
      <OnboardingClient />
    </Suspense>
  );
}

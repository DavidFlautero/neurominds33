import { Suspense } from "react";
import OnboardingClient from "./OnboardingClient";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="p-10">Cargando configuración inicial…</div>}>
      <OnboardingClient />
    </Suspense>
  );
}

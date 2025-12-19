import { Shell } from "../_components/Shell";
import OnboardingWizard from "./wizard";

export default function OnboardingPage() {
  return (
    <Shell
      title="Onboarding"
      subtitle="Cree el proyecto, defina objetivos y prepare la sincronización. Sin texto libre: solo opciones."
    >
      <OnboardingWizard />
    </Shell>
  );
}

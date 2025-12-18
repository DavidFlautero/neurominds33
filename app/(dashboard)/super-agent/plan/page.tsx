import { requireReady } from "@/lib/super-agent/requireReady";

export default async function PlanPage() {
  const projectId = "demo-project"; // luego dinámico
  const gate = await requireReady(projectId);

  if (!gate.ok) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Acceso bloqueado</h2>
        <p className="text-muted-foreground">
          Debes completar la configuración inicial antes de generar un plan.
        </p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Plan IA – Semana 1</h1>
      <p className="text-muted-foreground">
        (Aquí va el comité IA)
      </p>
    </div>
  );
}

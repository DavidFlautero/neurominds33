import { requireReady } from "@/lib/super-agent/requireReady";

export default async function PlanPage({ searchParams }: { searchParams: { projectId?: string } }) {
  const projectId = searchParams.projectId || "";
  if (!projectId) {
    return <div className="p-10">Falta projectId. Volvé a /super-agent.</div>;
  }

  const gate = await requireReady(projectId);

  if (!gate.ok) {
    return (
      <div className="p-10 space-y-2">
        <h2 className="text-xl font-bold">Acceso bloqueado</h2>
        <p className="text-muted-foreground">
          Primero completá la configuración inicial (wizard). Estado actual: <b>{gate.reason}</b>
        </p>
        <a className="inline-flex rounded-lg bg-black text-white px-4 py-2 text-sm"
           href={`/super-agent/onboarding?projectId=${encodeURIComponent(projectId)}`}>
          Ir al wizard
        </a>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-2">
      <h1 className="text-2xl font-bold">Plan IA – Semana 1</h1>
      <p className="text-muted-foreground">
        Siguiente paso: implementar comité IA y generar recomendaciones reales.
      </p>
    </div>
  );
}

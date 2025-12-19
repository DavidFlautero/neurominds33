import { Shell } from "../_components/Shell";

export default function LogsPage() {
  return (
    <Shell title="Logs" subtitle="Auditoría (fase 1: placeholder).">
      <div className="sa-panel">
        <div className="sa-h">Audit Log</div>
        <div className="sa-help">
          Aquí se registrará: decisiones del comité, aprobaciones, ejecuciones, resultados y aprendizaje HITL.
        </div>
      </div>
    </Shell>
  );
}

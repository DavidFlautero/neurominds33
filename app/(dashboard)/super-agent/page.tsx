export default function SuperAgentHome() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <a className="rounded-xl border p-4 hover:bg-muted" href="/super-agent/settings">
        <div className="font-medium">Settings</div>
        <div className="text-sm text-muted-foreground">
          Objetivos, guardrails, integraciones (GA4/Clarity/Ads) y preferencias.
        </div>
      </a>

      <a className="rounded-xl border p-4 hover:bg-muted" href="/super-agent/scans">
        <div className="font-medium">Scans</div>
        <div className="text-sm text-muted-foreground">
          Escaneo visual (desktop/mobile), secciones y recording de flujo.
        </div>
      </a>

      <a className="rounded-xl border p-4 hover:bg-muted" href="/super-agent/plan">
        <div className="font-medium">Plan semanal</div>
        <div className="text-sm text-muted-foreground">
          Top acciones priorizadas por impacto, esfuerzo y riesgo.
        </div>
      </a>

      <a className="rounded-xl border p-4 hover:bg-muted" href="/super-agent/approvals">
        <div className="font-medium">Aprobaciones</div>
        <div className="text-sm text-muted-foreground">
          Cola de decisiones: ejecutar Ads, cambios sensibles, rollback plan.
        </div>
      </a>

      <a className="rounded-xl border p-4 hover:bg-muted" href="/super-agent/tasks">
        <div className="font-medium">Tareas</div>
        <div className="text-sm text-muted-foreground">
          Workflow: detectado → aprobado → entregado → validado.
        </div>
      </a>

      <a className="rounded-xl border p-4 hover:bg-muted" href="/super-agent/ads">
        <div className="font-medium">Ads</div>
        <div className="text-sm text-muted-foreground">
          Propuestas, ejecución controlada, límites y rollback.
        </div>
      </a>
    </div>
  );
}

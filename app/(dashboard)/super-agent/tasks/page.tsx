export default function TasksPage() {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Tareas</h2>
      <p className="text-sm text-muted-foreground">
        Workflow: detectado → aprobado → en progreso → entregado → validación automática → cerrado.
      </p>

      <div className="rounded-xl border p-4 text-sm">
        Próximo: tabla de tareas + botón “Marcar entregado” que dispara /api/super-agent/validation.
      </div>
    </div>
  );
}

export default function LogsPage() {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Logs</h2>
      <p className="text-sm text-muted-foreground">
        Auditoría: quién aprobó qué, qué se ejecutó, y resultados de validación.
      </p>

      <div className="rounded-xl border p-4 text-sm">
        Próximo: tabla de audit_logs (DB) con filtros por fecha, tipo y severidad.
      </div>
    </div>
  );
}

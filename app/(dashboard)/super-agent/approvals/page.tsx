export default function ApprovalsPage() {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Aprobaciones</h2>
      <p className="text-sm text-muted-foreground">
        Cola de acciones que requieren validación humana (Ads, cambios sensibles, gastos).
      </p>

      <div className="rounded-xl border p-4 text-sm">
        Próximo: lista de acciones pendientes + aprobar/rechazar + muestra de rollback plan.
      </div>
    </div>
  );
}

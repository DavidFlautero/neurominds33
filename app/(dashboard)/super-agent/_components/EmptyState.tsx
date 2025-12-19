import Link from "next/link";

export function EmptyState() {
  return (
    <div className="sa-empty">
      <div className="sa-empty-card">
        <div className="sa-empty-badge">Neuromind33 Super Agent</div>
        <h2 className="sa-empty-title">No hay proyectos todavía</h2>
        <p className="sa-empty-text">
          Para desbloquear Plan, Ads y Competencia, primero cree un proyecto y sincronice el sitio con el snippet.
        </p>

        <div className="sa-empty-actions">
          <Link className="sa-btn" href="/super-agent/onboarding">
            Crear proyecto (Wizard)
          </Link>
          <Link className="sa-btn secondary" href="/super-agent/scans">
            Ir a Scan & Sync
          </Link>
        </div>

        <div className="sa-empty-foot">
          Consejo: use un ID corto (ej: <strong>panalesonline</strong>) y una URL válida (https://...).
        </div>
      </div>
    </div>
  );
}

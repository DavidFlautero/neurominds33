export const dynamic = "force-dynamic";

export default function ContextPage() {
  // Minimal UI (simple + robust). Later you can replace with the full premium modal wizard.
  return (
    <div className="sa-shell">
      <div className="sa-card">
        <div className="sa-title">Contexto — Wizard (v1)</div>
        <div className="sa-subtitle">
          Guardá datos del negocio con preguntas cerradas. Esto alimenta el comité.
        </div>

        <form
          className="sa-form"
          action={async (formData) => {
            "use server";
            const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            const payload = {
              projectId: "demo-project",
              projectName: String(formData.get("projectName") || ""),
              siteUrl: String(formData.get("siteUrl") || ""),
              objective: String(formData.get("objective") || ""),
              experienceLevel: String(formData.get("experienceLevel") || "none"),
              country: String(formData.get("country") || "AR"),
              industry: String(formData.get("industry") || ""),
              offer: String(formData.get("offer") || ""),
              budget: {
                weeklyUsd: Number(formData.get("weeklyUsd") || 0),
                monthlyUsd: Number(formData.get("monthlyUsd") || 0),
                approvalOverUsd: Number(formData.get("approvalOverUsd") || 25),
              },
              competitors: String(formData.get("competitors") || "")
                .split("\n")
                .map(s => s.trim())
                .filter(Boolean)
                .slice(0, 5),
            };

            await fetch(`${base}/api/super-agent/context`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          }}
        >
          <div className="sa-grid">
            <label className="sa-field">
              <div className="sa-label">Nombre del proyecto</div>
              <input name="projectName" className="sa-input" placeholder="Ej: Pañales - Tiendanube" defaultValue="Demo Project" />
            </label>

            <label className="sa-field">
              <div className="sa-label">URL del sitio</div>
              <input name="siteUrl" className="sa-input" placeholder="https://tusitio.com" defaultValue="https://neuromind33.online" />
            </label>

            <label className="sa-field">
              <div className="sa-label">Objetivo</div>
              <select name="objective" className="sa-input" defaultValue="ventas">
                <option value="ventas">Maximizar ventas</option>
                <option value="leads">Generar leads</option>
                <option value="trafico">Aumentar tráfico</option>
                <option value="awareness">Reconocimiento</option>
              </select>
            </label>

            <label className="sa-field">
              <div className="sa-label">Experiencia en Ads</div>
              <select name="experienceLevel" className="sa-input" defaultValue="none">
                <option value="none">Nula (primera vez)</option>
                <option value="some">Media</option>
                <option value="pro">Pro</option>
              </select>
            </label>

            <label className="sa-field">
              <div className="sa-label">País</div>
              <select name="country" className="sa-input" defaultValue="AR">
                <option value="AR">Argentina</option>
                <option value="CO">Colombia</option>
                <option value="MX">México</option>
                <option value="ES">España</option>
                <option value="US">USA</option>
              </select>
            </label>

            <label className="sa-field">
              <div className="sa-label">Rubro</div>
              <input name="industry" className="sa-input" placeholder="Ej: pañaleras, ecommerce, servicios..." />
            </label>

            <label className="sa-field">
              <div className="sa-label">Oferta principal</div>
              <input name="offer" className="sa-input" placeholder="Ej: Pañales al por mayor con envío 24hs" />
            </label>

            <label className="sa-field">
              <div className="sa-label">Presupuesto semanal (USD)</div>
              <input name="weeklyUsd" type="number" className="sa-input" defaultValue={100} />
            </label>

            <label className="sa-field">
              <div className="sa-label">Presupuesto mensual (USD)</div>
              <input name="monthlyUsd" type="number" className="sa-input" defaultValue={400} />
            </label>

            <label className="sa-field">
              <div className="sa-label">Aprobación si gasto &gt; (USD)</div>
              <input name="approvalOverUsd" type="number" className="sa-input" defaultValue={25} />
            </label>

            <label className="sa-field sa-field-full">
              <div className="sa-label">Competidores (1 por línea, max 5)</div>
              <textarea name="competitors" className="sa-textarea" placeholder="https://competidor1.com&#10;https://competidor2.com" />
            </label>
          </div>

          <button className="sa-btn" type="submit">Guardar contexto</button>
          <div className="sa-muted" style={{ marginTop: 10 }}>
            Después de guardar: hacé Scan y generá el Plan.
          </div>
        </form>
      </div>
    </div>
  );
}

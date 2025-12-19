export default function OnboardingPage() {
  return (
    <div className="sa-card" style={{ maxWidth: 720, margin: "80px auto" }}>
      <h1 className="sa-title">Bienvenido a tu Asistente de Marketing</h1>

      <p className="sa-subtitle">
        Te guiaremos paso a paso para conectar tu sitio, entender tu negocio
        y construir un plan de marketing con criterio profesional.
      </p>

      <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
        <a href="/super-agent/connect">
          <button className="sa-btn">
            Comenzar diagnóstico guiado
          </button>
        </a>

        <a href="/super-agent/connect">
          <button className="sa-btn secondary">
            Saltar (modo experto)
          </button>
        </a>
      </div>

      <div className="sa-step">
        <span>1</span> Conectamos tu sitio
      </div>
      <div className="sa-step">
        <span>2</span> Entendemos tu negocio
      </div>
      <div className="sa-step">
        <span>3</span> Auditamos tu web
      </div>
      <div className="sa-step">
        <span>4</span> Creamos tu plan de acción
      </div>
    </div>
  );
}

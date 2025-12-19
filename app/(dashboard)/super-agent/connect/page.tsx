export default function ConnectPage() {
  return (
    <div className="sa-card" style={{ maxWidth: 720, margin: "80px auto" }}>
      <h1 className="sa-title">Conectar tu sitio</h1>

      <p className="sa-subtitle">
        Antes de cualquier campaña, necesitamos conectar tu web para
        analizar comportamiento real y evitar decisiones a ciegas.
      </p>

      <div style={{ marginTop: 24 }}>
        <label className="sa-subtitle">URL del sitio</label>
        <input
          type="url"
          placeholder="https://tusitio.com"
          style={{
            marginTop: 8,
            width: "100%",
            padding: 14,
            borderRadius: 12,
            background: "#0b0d10",
            border: "1px solid #1e2430",
            color: "white",
          }}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <label className="sa-subtitle">Nombre del proyecto</label>
        <input
          type="text"
          placeholder="mi-tienda-online"
          style={{
            marginTop: 8,
            width: "100%",
            padding: 14,
            borderRadius: 12,
            background: "#0b0d10",
            border: "1px solid #1e2430",
            color: "white",
          }}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <button className="sa-btn">
          Generar código de conexión
        </button>
      </div>
    </div>
  );
}

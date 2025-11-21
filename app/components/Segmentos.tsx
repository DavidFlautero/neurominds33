export default function Segmentos() {
  return (
    <section id="segmentos">
      <div className="wrap grid2">
        
        {/* BLOQUE SOFTWARE A MEDIDA */}
        <div className="surface reveal">
          
          {/* Video a la izquierda */}
          <div className="mt-2 mb-6">
            <video
              src="/videos/softwaremedida.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="mx-auto w-full max-w-md rounded-3xl shadow-xl"
            />
          </div>

          {/* Texto a la derecha */}
          <h2 className="h2">Software a Medida</h2>

          <p className="p">
            Construimos sistemas personalizados con enfoque en escalabilidad, seguridad e
            integración. Desde paneles internos hasta automatizaciones completas para tu
            operación.
          </p>

          <p className="p">
            Ideal para empresas que necesitan dashboards avanzados, flujos propios,
            integraciones profundas y control total sobre sus procesos.
          </p>

          <div style={{ marginTop: 14 }}>
            <a className="btn" href="/empresas">
              Ver soluciones Enterprise →
            </a>
          </div>
        </div>

        {/* BLOQUE PYMES */}
        <div className="surface reveal" id="pymes">
          <h2 className="h2">Para PYMES</h2>
          <p className="p">
            Implementación veloz, costos claros y foco en mejorar ventas y procesos.
            Paquetes listos para escalar tu negocio.
          </p>

          <div className="grid3" style={{ marginTop: 10 }}>
            <div className="card">
              <h3>Pack Tienda</h3>
              <p>Bagisto + pagos + logística en 4–6 semanas.</p>
            </div>

            <div className="card">
              <h3>Automatización Lite</h3>
              <p>Flujos repetitivos, alertas y conciliación de datos.</p>
            </div>

            <div className="card">
              <h3>Agente IA Básico</h3>
              <p>WhatsApp + FAQs + derivación inteligente a humano.</p>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <a className="btn" href="/tiendas">
              Ver opciones PYMES →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

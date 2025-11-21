export default function Segmentos() {
  return (
    <section
      id="segmentos"
      className="relative overflow-hidden"
    >
      {/* VIDEO DE FONDO */}
      <video
        src="/videos/softwaremedida.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      {/* CAPA SUAVE PARA MEJORAR LECTURA */}
      <div className="absolute inset-0 bg-black/25" />

      {/* CONTENIDO ENCIMA DEL VIDEO */}
      <div className="relative wrap py-16">
        <div className="grid2 gap-8">
          {/* CARD SOFTWARE A MEDIDA */}
          <div className="surface reveal max-w-xl">
            <img
              src="/images/softwaremedida/empresas2.png"
              alt="Interfaz de software a medida con dashboards avanzados"
              className="mb-4 w-full rounded-3xl"
            />

            <h2 className="h2">Software a Medida</h2>
            <p className="p">
              Diseñamos y desarrollamos sistemas personalizados: paneles internos, automatizaciones,
              integraciones y dashboards que se ajustan exactamente a cómo funciona tu negocio.
            </p>
            <p className="p">
              Ideal para empresas que necesitan procesos propios, más control y una base tecnológica
              lista para escalar, sin depender de soluciones genéricas.
            </p>

            <a href="/empresas" className="btn mt-4">
              Ver soluciones Enterprise →
            </a>
          </div>

          {/* CARD PYMES */}
          <div className="surface reveal max-w-xl" id="pymes">
            <h2 className="h2">Para PYMES</h2>
            <p className="p">
              Implementación veloz, costos claros y foco en vender más. Paquetes listos para
              digitalizar tu operación sin volverte loco.
            </p>

            <div className="grid3 mt-4">
              <div className="card">
                <h3>Pack Tienda</h3>
                <p>Bagisto + pagos + logística en 4–6 semanas.</p>
              </div>
              <div className="card">
                <h3>Automatización Lite</h3>
                <p>Flujos repetitivos, alertas y conciliación básica.</p>
              </div>
              <div className="card">
                <h3>Agente IA Básico</h3>
                <p>WhatsApp + FAQs + derivación a humano.</p>
              </div>
            </div>

            <a href="/tiendas" className="btn mt-4">
              Ver opciones PYMES →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

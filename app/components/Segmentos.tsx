export default function Segmentos() {
  return (
    <section id="segmentos">
      <div className="wrap grid2">
        {/* Bloque Empresas */}
        <div className="surface reveal">
          <h2 className="h2">Para Empresas</h2>
          <p className="p">
            Integraciones globales, SLAs, seguridad y escalabilidad. Equipo dedicado y
            procesos maduros para proyectos de misión crítica.
          </p>
          <p className="p">
            Ideal para compañías que necesitan integrar ERP/CRM, pagos multi-país, logística
            avanzada y arquitecturas en la nube listas para crecer.
          </p>

          {/* Imagen Enterprise */}
          <div className="mt-6">
            <img
              src="/images/serviceempr/se4rvicios-empresas.png"
              alt="Plataforma Enterprise integrando ERP, CRM, pagos, logística y analytics"
              className="mx-auto w-full max-w-md rounded-3xl shadow-xl"
            />
          </div>

          <div style={{ marginTop: 14 }}>
            <a className="btn" href="/empresas">
              Ver soluciones Enterprise →
            </a>
          </div>
        </div>

        {/* Bloque PYMES */}
        <div className="surface reveal" id="pymes">
          <h2 className="h2">Para PYMES</h2>
          <p className="p">
            Implementación veloz, costos claros y foco en ROI. Paquetes pensados para vender más.
          </p>
          <div className="grid3" style={{ marginTop: 10 }}>
            <div className="card">
              <h3>Pack Tienda</h3>
              <p>Bagisto + pagos + logística en 4–6 semanas.</p>
            </div>
            <div className="card">
              <h3>Automatización Lite</h3>
              <p>Flujos repetitivos, alertas y conciliación.</p>
            </div>
            <div className="card">
              <h3>Agente IA Básico</h3>
              <p>WhatsApp + FAQs + derivación a humano.</p>
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

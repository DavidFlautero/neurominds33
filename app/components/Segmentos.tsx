export default function Segmentos(){
  return (
    <section id="empresas">
      <div className="wrap grid2">
        <div className="surface reveal">
          <h2 className="h2">Para Empresas</h2>
          <p className="p">Integraciones globales, SLAs, seguridad y escalabilidad. Equipo dedicado y procesos maduros.</p>
          <div className="grid3" style={{marginTop:10}}>
            <div className="card"><h3>Programa corporativo</h3><p>Equipo dedicado, gestión de producto y cobertura 24/7.</p></div>
            <div className="card"><h3>Integraciones</h3><p>ERP/CRM, pagos multi-país, logística y analítica.</p></div>
            <div className="card"><h3>Escalabilidad</h3><p>Nube, microservicios y observabilidad.</p></div>
          </div>
          <div style={{marginTop:14}}><a className="btn" href="/automatizacion">Ver soluciones Enterprise</a></div>
        </div>
        <div className="surface reveal" id="pymes">
          <h2 className="h2">Para PYMES</h2>
          <p className="p">Implementación veloz, costos claros y foco en ROI. Paquetes pensados para vender más.</p>
          <div className="grid3" style={{marginTop:10}}>
            <div className="card"><h3>Pack Tienda</h3><p>Bagisto + pagos + logística en 4–6 semanas.</p></div>
            <div className="card"><h3>Automatización Lite</h3><p>Flujos repetitivos, alertas y conciliación.</p></div>
            <div className="card"><h3>Agente IA Básico</h3><p>WhatsApp + FAQs + derivación a humano.</p></div>
          </div>
          <div style={{marginTop:14}}><a className="btn" href="/tiendas">Ver opciones PYMES</a></div>
        </div>
      </div>
    </section>
  );
}

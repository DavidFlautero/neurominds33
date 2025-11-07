export default function Vision(){
  return (
    <section id="vision">
      <div className="wrap grid2">
        <div className="surface reveal">
          <h2 className="h2">Nuestra visión</h2>
          <p className="p">Construimos sistemas que amplifican el negocio: diseño impecable, arquitectura robusta y automatización inteligente. Trabajamos como socios estratégicos.</p>
          <ul className="p" style={{marginTop:6,lineHeight:1.8}}>
            <li><b>Arquitectura</b> modular con integraciones seguras y rendimiento de clase mundial.</li>
            <li><b>Experiencia</b> clara y estética premium que convierte.</li>
            <li><b>Evolución</b> continua con métricas y roadmap compartido.</li>
          </ul>
        </div>
        <div className="surface eye reveal" aria-label="Ojo neural">
          <img src="/images/vision/ojo.png" alt="Ojo neural conceptual" />
        </div>
      </div>
    </section>
  );
}

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
          <img src="https://images.unsplash.com/photo-1516315720917-85a6f2d36e84?q=80&w=1920&auto=format&fit=crop" alt="Ojo neural conceptual" />
        </div>
      </div>
    </section>
  );
}

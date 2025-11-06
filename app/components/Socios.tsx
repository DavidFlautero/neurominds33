export default function Socios(){
  return (
    <section id="socios">
      <div className="wrap surface reveal">
        <h2 className="h2">¿Negocio con potencial pero sin presupuesto? Seamos socios</h2>
        <p className="p">Para proyectos con tracción o alto potencial, trabajamos con <b>revenue share / equity + fee reducido</b>.</p>
        <div className="grid3" style={{marginTop:12}}>
          <div className="card"><h3>Cómo funciona</h3><p>Evaluación en 40’, propuesta con hitos, % de revenue y duración.</p></div>
          <div className="card"><h3>Qué pedimos</h3><p>Compromiso operativo, validación mínima y métricas compartidas.</p></div>
          <div className="card"><h3>Qué aportamos</h3><p>Diseño/tech, automatización, e-commerce, data y roadmap.</p></div>
        </div>
        <div style={{marginTop:14}}>
          <a className="btn primary" href="#contacto" id="openModalSocios">Postular mi proyecto</a>
          <a className="btn" href="/ia">Ver capacidades</a>
        </div>
      </div>
    </section>
  );
}

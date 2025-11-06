export default function CTAContacto(){
  return (
    <section id="contacto" aria-label="Contacto y CTA final">
      <div className="wrap surface reveal" style={{textAlign:"center"}}>
        <h2 className="h2">¿Listo para lanzar algo serio?</h2>
        <p className="p" style={{maxWidth:720, margin:"8px auto 18px"}}>Contanos tu objetivo y enviamos una propuesta en 48 h.</p>
        <div style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
          <button className="btn primary" id="openModalBottom">Hablar ahora</button>
          <a className="btn" href="/login">Login / Panel</a>
        </div>
      </div>
    </section>
  );
}

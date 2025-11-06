export default function Hero(){
  return (
    <header className="hero">
      <div className="hero-media" aria-hidden="true">
        <video src="/assets/hero.mp4" autoPlay muted loop playsInline poster="/assets/hero.jpg"></video>
      </div>
      <div className="hero-overlay"></div>
      <div className="wrap hero-wrap">
        <div className="reveal">
          <span className="eyebrow">Automatización · IA · Productos digitales</span>
          <h1 className="h1">Software claro. Crecimiento real.</h1>
          <p className="lead">Diseñamos e integramos plataformas que mejoran ventas y eficiencia. Sin lista de precios: cotizamos por alcance e impacto.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:18}}>
            <a className="btn primary" href="#servicios">Explorar servicios</a>
            <a className="btn" href="#proceso">Cómo trabajamos</a>
          </div>
        </div>
        <div className="reveal">
          <div className="mock" aria-label="Panel del cliente">
            <img src="https://placehold.co/1200x720/FFFFFF/2D3648?text=Panel+del+Cliente" alt="Panel del cliente" />
          </div>
        </div>
      </div>
    </header>
  );
}

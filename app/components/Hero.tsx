export default function Hero() {
  return (
    <header className="hero">
      {/* Fondo con textura/ondas suaves */}
      <div className="hero-media" aria-hidden="true">
        <img src="/assets/hero-waves.jpg" alt="" />
      </div>

      {/* Degradado para legibilidad del texto */}
      <div className="hero-overlay" aria-hidden={true} />

      {/* Contenido */}
      <div className="wrap hero-wrap">
        {/* Columna izquierda: texto */}
        <div className="reveal hero-copy">
          <span className="eyebrow">Estrategia · Software · IA & Automatización</span>

          <h1 className="h1">
            Software claro.<br />Crecimiento real.
          </h1>

          <p className="lead">
            Diseñamos e integramos plataformas que mejoran ventas y eficiencia.
            Sin lista de precios: cotizamos por alcance e impacto.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
            <a className="btn primary" href="#servicios">Explorar servicios</a>
            <a className="btn" href="#proceso">Cómo trabajamos</a>
          </div>
        </div>

        {/* Columna derecha: imagen (sin marco + difuminada) */}
        <figure className="hero-figure reveal" aria-label="Imagen conceptual NeuroMind33">
          <img
            className="hero-woman"
            src="/brand/woman.png"     // <— coloca tu imagen en /public/brand/woman.png
            alt="Perfil femenino, estética premium"
          />
        </figure>
      </div>

      {/* Onda superior animada que cruza de lado a lado por encima del contenido */}
      <div className="hero-wave" aria-hidden={true} />
    </header>
  );
}


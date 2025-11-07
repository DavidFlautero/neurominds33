export default function Hero() {
  return (
    <header className="hero">
      {/* Fondo con ondas / textura suave */}
      <div className="hero-media" aria-hidden="true">
        {/* Imagen de fondo con ondas claras */}
        <img
          src="/assets/hero-waves.jpg"
          alt=""
        />
      </div>

      {/* Capa de degradado que oscurece arriba y se funde al blanco abajo */}
      <div className="hero-overlay" aria-hidden="true"></div>

      {/* Contenido principal */}
      <div className="wrap hero-wrap">
        {/* Columna izquierda: texto */}
        <div className="reveal">
          <span className="eyebrow">
            Estrategia · Software · IA & Automatización
          </span>

          <h1 className="h1">
            Software claro.<br />
            Crecimiento real.
          </h1>

          <p className="lead">
            Diseñamos e integramos plataformas que mejoran ventas y eficiencia.
            Sin lista de precios: cotizamos por alcance e impacto.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            <a className="btn primary" href="#servicios">
              Explorar servicios
            </a>
            <a className="btn" href="#proceso">
              Cómo trabajamos
            </a>
          </div>
        </div>

        {/* Columna derecha: mockup producto */}
        <div className="reveal">
          <div className="mock" aria-label="Panel del cliente">
            {/* Cuando tengas tu propio diseño, reemplaza este src */}
            <img
              src="/assets/mock-dashboard-neuromind33.png"
              alt="Panel de control NeuroMind33"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Hero() {
  return (
    <header className="hero">
      {/* Fondo: imagen con ondas claras */}
      <div className="hero-media" aria-hidden="true">
        <img src="/assets/hero-waves.jpg" alt="" />
      </div>

      {/* Degradado para legibilidad del texto */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Contenido */}
      <div className="wrap hero-wrap">
        {/* Columna izquierda: texto */}
        <div className="reveal">
          <span className="eyebrow">
            Estrategia · Software · IA & Automatización
          </span>

          <h1 className="h1">
            Software claro.
            <br />
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

        {/* Columna derecha: imagen mujer */}
        <div className="reveal">
          <div className="mock" aria-label="Hero visual">
            <img
              src="/brand/woman.png"
              alt="Perfil femenino, estilo premium, NeuroMind33"
              style={{ display: "block", width: "100%", height: "auto", borderRadius: 12 }}
            />
          </div>
        </div>
      </div>

      {/* Onda animada (cambia de color suave) */}
      <div className="nm-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="nmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a5f3fc">
                <animate
                  attributeName="stop-color"
                  values="#a5f3fc; #60a5fa; #22d3ee; #a5f3fc"
                  dur="14s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#93c5fd">
                <animate
                  attributeName="stop-color"
                  values="#93c5fd; #38bdf8; #06b6d4; #93c5fd"
                  dur="14s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          {/* Capa base */}
          <path
            fill="url(#nmGradient)"
            fillOpacity="0.35"
            d="M0,260 C240,340 480,120 720,200 C960,280 1200,180 1440,240 L1440,400 L0,400 Z"
          />
          {/* Capa superior */}
          <path
            fill="url(#nmGradient)"
            fillOpacity="0.22"
            d="M0,300 C260,360 520,180 780,230 C1040,280 1300,220 1440,260 L1440,400 L0,400 Z"
          />
        </svg>
      </div>
    </header>
  );
}

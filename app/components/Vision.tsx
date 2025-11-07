export default function Vision() {
  return (
    <section id="vision">
      <div className="wrap grid2">
        {/* Columna de texto */}
        <div className="surface reveal">
          <h2 className="h2">Nuestra visión</h2>
          <p className="p">
            Construimos sistemas que amplifican el negocio: diseño impecable, arquitectura
            robusta y automatización inteligente. Trabajamos como socios estratégicos.
          </p>
          <ul className="p" style={{ marginTop: 6, lineHeight: 1.8 }}>
            <li>
              <b>Arquitectura</b> modular con integraciones seguras y rendimiento de clase mundial.
            </li>
            <li>
              <b>Experiencia</b> clara y estética premium que convierte.
            </li>
            <li>
              <b>Evolución</b> continua con métricas y roadmap compartido.
            </li>
          </ul>
        </div>

        {/* Columna visual: ojo en video */}
        <div className="surface eye reveal" aria-label="Ojo neural">
          <video
            className="nm-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/vision/ojo-poster.jpg"   // <- imagen de portada (opcional pero recomendable)
            aria-label="Ojo neural en movimiento"
          >
            {/* si tienes versión .webm, déjala primero por eficiencia */}
            <source src="/images/vision/ojo.webm" type="video/webm" />
            <source src="/images/vision/ojo.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>

          {/* Fallback para usuarios con “reducir movimiento” o navegadores sin video */}
          <img
            className="nm-video-fallback"
            src="/images/vision/ojo-poster.jpg"
            alt="Ojo neural conceptual"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';

export default function Vision() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Event listener para errores de carga
    const handleError = (e: Event) => {
      console.error('Error cargando video:', e);
      // Opcional: mostrar fallback aquí
    };
    video.addEventListener('error', handleError);

    // Intenta reproducir
    const playVideo = () => {
      video.play().catch((err) => console.log('Autoplay bloqueado:', err));
    };

    playVideo();

    // Reproduce al scroll (para PC)
    const onScroll = () => {
      if (video.getBoundingClientRect().top < window.innerHeight * 0.8) {
        playVideo();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      video.removeEventListener('error', handleError);
    };
  }, []);

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
            ref={videoRef}
            className="nm-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"  // Cambiado a 'auto' para forzar carga
            poster="/images/vision/ojo-poster.jpg"
            aria-label="Ojo neural en movimiento"
            onError={(e) => console.error('Video error:', e)}  // Debug
          >
            {/* Solo MP4 por ahora - más compatible */}
            <source src="/images/vision/ojo.mp4" type="video/mp4" />
            {/* Fallback: texto solo si TODO falla */}
            Tu navegador no soporta video HTML5.
          </video>

          {/* Fallback imagen SIEMPRE visible si video falla */}
          <noscript>
            <img
              className="nm-video-fallback"
              src="/images/vision/ojo-poster.jpg"
              alt="Ojo neural conceptual"
              loading="lazy"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </noscript>
        </div>
      </div>
    </section>
  );
}
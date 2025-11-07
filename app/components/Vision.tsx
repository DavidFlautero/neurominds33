'use client';
import { useEffect, useRef } from 'react';

export default function Vision() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intenta reproducir al cargar
    const tryPlay = () => {
      video.play().catch(() => {
        // Si falla, esperamos interacción
        const unlock = () => {
          video.play();
          document.removeEventListener('click', unlock);
          document.removeEventListener('scroll', unlock);
        };
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('scroll', unlock, { once: true });
      });
    };

    tryPlay();

    // También al hacer scroll (mejora UX)
    const onScroll = () => {
      if (video.getBoundingClientRect().top < window.innerHeight * 0.8) {
        tryPlay();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section id="vision">
      <div className="wrap grid2">
        <div className="surface reveal">
          <h2 className="h2">Nuestra visión</h2>
          <p className="p">
            Construimos sistemas que amplifican el negocio: diseño impecable, arquitectura
            robusta y automatización inteligente. Trabajamos como socios estratégicos.
          </p>
          <ul className="p" style={{ marginTop: 6, lineHeight: 1.8 }}>
            <li><b>Arquitectura</b> modular con integraciones seguras y rendimiento de clase mundial.</li>
            <li><b>Experiencia</b> clara y estética premium que convierte.</li>
            <li><b>Evolución</b> continua con métricas y roadmap compartido.</li>
          </ul>
        </div>

        <div className="surface eye reveal" aria-label="Ojo neural">
          <video
            ref={videoRef}
            className="nm-video"
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/vision/ojo-poster.jpg"
            aria-label="Ojo neural en movimiento"
          >
            <source src="/images/vision/ojo.webm" type="video/webm" />
            <source src="/images/vision/ojo.mp4" type="video/mp4" />
            {/* Fallback visual */}
            <img
              src="/images/vision/ojo.jpg"
              alt="Ojo neural conceptual"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </video>
        </div>
      </div>
    </section>
  );
}

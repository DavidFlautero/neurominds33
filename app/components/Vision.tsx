'use client';

import { useEffect, useRef } from 'react';

export default function Vision() {
  const eyeRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = eyeRef.current;
    if (!v) return;

    // Fix Safari/iOS autoplay
    v.muted = true;
    (v as any).playsInline = true;
    (v as any).webkitPlaysinline = true;

    const handleError = (e: Event) => console.error('Error cargando video OJO:', e);
    v.addEventListener('error', handleError);

    const tryPlay = () => v.play().catch(() => {/* ignorar autoplay bloqueado */});
    tryPlay();

    const onScroll = () => {
      const top = v.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.85) {
        tryPlay();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      v.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <section id="vision" className="relative isolate py-20">
      {/* === FONDO FULL-BLEED DETRÁS === */}
      <div className="fullbg" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/videos/energia-neuro33-poster.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/videos/fondovision.mp4.mp4" type="video/mp4" />
        </video>
      </div>

      {/* === CONTENIDO === */}
      <div className="wrap grid2 relative z-10">
        {/* Texto */}
        <div className="surface reveal backdrop-blur-[2px] bg-white/60 dark:bg-black/40">
          <h2 className="h2">Nuestra visión</h2>
          <p className="p">
            Construimos sistemas que amplifican el negocio: diseño impecable, arquitectura robusta
            y automatización inteligente. Trabajamos como socios estratégicos.
          </p>
          <ul className="p" style={{ marginTop: 6, lineHeight: 1.8 }}>
            <li><b>Arquitectura</b> modular con integraciones seguras y rendimiento de clase mundial.</li>
            <li><b>Experiencia</b> clara y estética premium que convierte.</li>
            <li><b>Evolución</b> continua con métricas y roadmap compartido.</li>
          </ul>
        </div>

        {/* Video del ojo */}
        <div className="surface eye reveal eye-box" aria-label="Ojo neural">
          <video
            ref={eyeRef}
            className="nm-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/vision/ojo-poster.jpg"
            onError={(e) => console.error('Video OJO error:', e)}
          >
            <source src="/images/vision/ojo.mp4" type="video/mp4" />
          </video>
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

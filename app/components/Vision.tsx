'use client';

import { useEffect, useRef } from 'react';

export default function Vision() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = (e: Event) => console.error('Error cargando video:', e);
    video.addEventListener('error', handleError);

    const playVideo = () => {
      video.play().catch(() => {/* autoplay bloqueado, ignorar */});
    };
    playVideo();

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
    <section id="vision" className="relative isolate py-20">
      {/* FONDO DE VIDEO FULL-BLEED DETRÁS */}
      <div className="fullbg" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          poster="/videos/energia-neuro33-poster.jpg"
        >
          {/* <source src="/videos/energia-neuro33.webm" type="video/webm" /> */}
          <source src="/videos/energia-neuro33.mp4" type="video/mp4" />
        </video>
      </div>

      {/* CONTENIDO */}
      <div className="wrap grid2">
        {/* Columna de texto */}
        <div className="surface reveal">
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

        {/* Columna visual: ojo encima del fondo */}
        <div className="surface eye reveal" aria-label="Ojo neural">
          <video
            ref={videoRef}
            className="nm-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/vision/ojo-poster.jpg"
            aria-label="Ojo neural en movimiento"
            onError={(e) => console.error('Video error:', e)}
          >
            <source src="/images/vision/ojo.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
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

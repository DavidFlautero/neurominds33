'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch(() => {});
    };

    playVideo();

    const onScroll = () => {
      if (video.getBoundingClientRect().top < window.innerHeight) {
        playVideo();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="hero">
      {/* Video de fondo */}
      <div className="hero-media" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/hero-poster.jpg"
        >
          <source src="/images/hero/woman.mp4" type="video/mp4" />
          <source src="/images/woman.webm" type="video/webm" />
          <img src="/images/woman.jpg" alt="" className="hero-video-fallback" />
        </video>
      </div>

      {/* Degradado */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Contenido flotante */}
      <div className="hero-floating">
        <div className="reveal hero-copy">
          <span className="eyebrow">Estrategia · Software · IA & Automatización</span>
          <h1 className="h1">
            Software claro.<br />Crecimiento real.
          </h1>
          <p className="lead">
            Diseñamos e integramos plataformas que mejoran ventas y eficiencia.
            Sin lista de precios: cotizamos por alcance e impacto.
          </p>
          <div className="hero-buttons">
            <a className="btn primary" href="#servicios">Explorar servicios</a>
            <a className="btn" href="#proceso">Cómo trabajamos</a>
          </div>
        </div>
      </div>

      {/* Onda animada */}
      <div className="hero-wave" aria-hidden="true" />
    </header>
  );
}
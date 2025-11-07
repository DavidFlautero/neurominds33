'use client';

import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => {
    const video = videoRef.current;
    if (video && !isPlaying) {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Reproduce al hacer clic en cualquier botón del hero
  const handleButtonClick = (e: React.MouseEvent) => {
    playVideo();
    // Opcional: si querés que el enlace funcione también
    const href = (e.target as HTMLAnchorElement).getAttribute('href');
    if (href && href.startsWith('#')) {
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="hero">
      {/* Video de fondo */}
      <div className="hero-media" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          loop
          muted
          playsInline
          preload="metadata"
          poster="/assets/hero-poster.jpg"
        >
          <source src="/images/hero/woman.mp4" type="video/mp4" />
          <source src="/assets/hero-video.webm" type="video/webm" />
          <img src="/assets/hero-waves.jpg" alt="" />
        </video>
      </div>

      {/* Degradado */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Contenido a la izquierda */}
      <div className="hero-content">
        <div className="reveal">
          <span className="eyebrow">Estrategia · Software · IA & Automatización</span>
          <h1 className="h1">
            Software claro.<br />Crecimiento real.
          </h1>
          <p className="lead">
            Diseñamos e integramos plataformas que mejoran ventas y eficiencia.
            Sin lista de precios: cotizamos por alcance e impacto.
          </p>
          <div className="hero-buttons">
            <a className="btn primary" href="#servicios" onClick={handleButtonClick}>
              Explorar servicios
            </a>
            <a className="btn" href="#proceso" onClick={handleButtonClick}>
              Cómo trabajamos
            </a>
          </div>
        </div>
      </div>

      {/* Botón de play opcional (puedes quitarlo si no querés) */}
      {!isPlaying && (
        <div className="play-button" onClick={playVideo} aria-label="Reproducir video">
        </div>
      )}
    </header>
  );
}
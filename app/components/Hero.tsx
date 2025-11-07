'use client';

import { useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const playVideoOnce = () => {
    const video = videoRef.current;
    if (!video || hasPlayed) return;

    // Forzar carga
    video.load();

    // Reproducir
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setHasPlayed(true);
        })
        .catch((error) => {
          console.error("Error al reproducir video:", error);
        });
    }
  };

  // Reproduce al hacer clic en cualquier botón
  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    playVideoOnce();

    // Scroll suave al enlace
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <header className="hero">
      {/* Video de fondo */}
      <div className="hero-media" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          preload="auto"
          poster="/assets/hero-poster.jpg"
          onError={() => console.error("Video falló al cargar")}
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
          {/* Fallback si MP4 falla */}
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

      {/* Indicador visual (opcional) */}
      {!hasPlayed && (
        <div className="play-hint" style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '14px',
          zIndex: 12,
          background: 'rgba(0,0,0,0.5)',
          padding: '8px 16px',
          borderRadius: '999px',
          pointerEvents: 'none'
        }}>
          Haz clic en un botón para ver el video
        </div>
      )}
    </header>
  );
}
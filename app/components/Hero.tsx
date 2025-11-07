'use client';

import { useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const playVideo = () => {
    const video = videoRef.current;
    if (!video || hasPlayed) return;

    video.currentTime = 0; // Reinicia
    video.play().then(() => {
      setHasPlayed(true);
    }).catch(() => {});
  };

  const pauseAndReset = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0; // Vuelve al inicio (pero se ve poster)
    }
    setIsHovered(false);
  };

  return (
    <header className="hero">
      {/* Imagen estática (siempre visible) */}
      <img
        src="/assets/hero-poster.jpg"
        alt="Chica estática"
        className="hero-poster"
      />

      {/* Video (solo se ve al hover) */}
      <div className="hero-media" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          preload="metadata"
          onEnded={() => setHasPlayed(true)}
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Zona de hover (35% derecha) */}
      <div
        className="hover-zone"
        onMouseEnter={() => {
          setIsHovered(true);
          playVideo();
        }}
        onMouseLeave={pauseAndReset}
      />

      {/* Degradado */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Texto */}
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
            <a className="btn primary" href="#servicios">
              Explorar servicios
            </a>
            <a className="btn" href="#proceso">
              Cómo trabajamos
            </a>
          </div>
        </div>
      </div>

      {/* Indicador opcional */}
      {isHovered && !hasPlayed && (
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          zIndex: 20
        }}>
          Reproduciendo...
        </div>
      )}
    </header>
  );
}
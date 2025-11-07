// app/components/Hero.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reproduce automáticamente
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay bloqueado → intenta al hacer clic
        const handleFirstInteraction = () => {
          video.play();
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
      });
    }

    // Loop infinito
    const handleEnded = () => {
      video.currentTime = 0;
      video.play();
    };
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <header className="hero">
      {/* Video de fondo – autoplay + loop */}
      <div className="hero-media">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          preload="auto"
          loop={false} // Controlado por JS
        >
          <source src="/images/hero/woman1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Degradado */}
      <div className="hero-overlay" />

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
    </header>
  );
}
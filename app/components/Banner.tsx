'use client';
import { useEffect, useRef } from 'react';

export default function SeccionAutomatizacion() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const play = () => video.play().catch(() => {});

    play(); // intento inmediato

    const tryOnInteraction = () => {
      if (video.getBoundingClientRect().top < window.innerHeight * 1.5) {
        play();
        window.removeEventListener('scroll', tryOnInteraction);
        window.removeEventListener('touchstart', tryOnInteraction);
      }
    };

    window.addEventListener('scroll', tryOnInteraction);
    window.addEventListener('touchstart', tryOnInteraction);

    return () => {
      window.removeEventListener('scroll', tryOnInteraction);
      window.removeEventListener('touchstart', tryOnInteraction);
    };
  }, []);

  return (
    <section id="automatizacion" className="nm-section relative overflow-hidden">
      {/* VIDEO DE FONDO – ahora SÍ se ve */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/fondobanner.mp4" type="video/mp4" />
      </video>

      {/* Overlay muy sutil (si querés) – si no querés nada, borrá esta línea */}
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />

      {/* TEXTO ENCIMA DEL VIDEO */}
      <div className="relative z-20 wrap">
        <div className="nm-stack text-center md:text-left">
          <span className="eyebrow block text-white drop-shadow-lg">Tecnología Inteligente</span>
          <h2 className="h2 text-white drop-shadow-2xl mt-4">
            Automatización que transforma
          </h2>
          <p className="p text-gray-100 max-w-3xl mt-6 drop-shadow-lg text-lg leading-relaxed">
            Fusionamos inteligencia artificial y desarrollo avanzado para crear procesos autónomos,
            precisos y escalables. Tu empresa evoluciona, nosotros hacemos que el sistema piense.
          </p>
        </div>
      </div>
    </section>
  );
}
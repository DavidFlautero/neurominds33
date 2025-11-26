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

    play();

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
    <section id="automatizacion" className="nm-section relative overflow-hidden min-h-[35vh] flex items-center py-6">
      {/* VIDEO DE FONDO */}
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

      {/* Overlay mínimo */}
      <div className="absolute inset-0 bg-black/15 z-10 pointer-events-none" />

      {/* CONTENEDOR SUPER COMPACTO */}
      <div className="relative z-20 w-full max-w-lg mx-auto px-3">
        <div className="text-center">
          
          {/* Eyebrow ultra compacto */}
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-blue-500/80 rounded text-white text-xs font-medium uppercase tracking-tight">
              Tecnología Inteligente
            </span>
          </div>

          {/* Título compacto en una línea */}
          <h2 className="text-lg md:text-xl font-bold text-white mb-3 drop-shadow">
            Automatización que transforma
          </h2>

          {/* Texto ultra compacto - bordes pegados al texto */}
          <div className="bg-black/45 backdrop-blur rounded-lg p-3 border border-white/5 max-w-sm mx-auto">
            <p className="text-xs md:text-sm text-white leading-tight">
              <span className="text-blue-100 font-medium">
                Fusionamos inteligencia artificial y desarrollo avanzado
              </span>{' '}
              para crear procesos autónomos, precisos y escalables.
              <span className="block mt-1 text-white/90 text-xs">
                Tu empresa evoluciona, <span className="font-semibold">nosotros hacemos que el sistema piense.</span>
              </span>
            </p>
          </div>

          {/* CTA mínimo */}
          <div className="mt-4">
            <button className="px-3 py-1.5 bg-white/95 text-blue-900 rounded font-semibold text-xs hover:bg-white transition-colors shadow">
              Ver Tecnología
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
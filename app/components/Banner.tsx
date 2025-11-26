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
    <section id="automatizacion" className="nm-section relative overflow-hidden min-h-[60vh] flex items-center">
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

      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Eyebrow/tagline - más pequeño */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-white text-xs font-medium tracking-wide uppercase">
              Tecnología Inteligente
            </span>
          </div>

          {/* Título principal - reducido */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-snug drop-shadow-lg">
            Automatización
            <span className="block text-blue-100 mt-1">
              que transforma
            </span>
          </h2>

          {/* Contenedor del texto - mucho más compacto */}
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 shadow-lg max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-white font-light leading-relaxed">
              <span className="font-medium text-blue-200">
                Fusionamos inteligencia artificial y desarrollo avanzado
              </span>{' '}
              para crear procesos autónomos, precisos y escalables.
              <span className="block mt-3 text-white/95 text-sm md:text-base">
                Tu empresa evoluciona, <span className="font-semibold text-white">nosotros hacemos que el sistema piense.</span>
              </span>
            </p>
          </div>

          {/* CTA más discreto */}
          <div className="mt-8">
            <button className="px-6 py-3 bg-white/95 text-blue-900 rounded-lg font-semibold text-sm hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
              Descubre Nuestra Tecnología
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
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
    <section id="automatizacion" className="nm-section relative overflow-hidden min-h-[80vh] flex items-center">
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

      {/* Overlay sutil para todo el fondo */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* CONTENEDOR PRINCIPAL - CENTRADO */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Eyebrow/tagline */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-sm font-semibold tracking-wide uppercase shadow-lg">
              Tecnología Inteligente
            </span>
          </div>

          {/* Título principal */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
            Automatización
            <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mt-2">
              que transforma
            </span>
          </h2>

          {/* Contenedor del texto con fondo semitransparente elegante */}
          <div className="inline-block bg-black/60 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl lg:text-3xl text-white font-light leading-relaxed md:leading-loose">
              <span className="font-semibold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Fusionamos inteligencia artificial y desarrollo avanzado
              </span>{' '}
              para crear procesos autónomos, precisos y escalables.
              <br />
              <span className="block mt-4 text-white/90">
                Tu empresa evoluciona, <span className="font-bold text-white">nosotros hacemos que el sistema piense.</span>
              </span>
            </p>
          </div>

          {/* CTA adicional opcional */}
          <div className="mt-12">
            <button className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Descubre Nuestra Tecnología
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';
import { useEffect, useRef } from 'react';

export default function Resultados() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const play = () => video.play().catch(() => {});
    play();

    const tryPlay = () => {
      if (video.getBoundingClientRect().top < window.innerHeight * 1.5) {
        play();
        window.removeEventListener('scroll', tryPlay);
        window.removeEventListener('touchstart', tryPlay);
      }
    };

    window.addEventListener('scroll', tryPlay);
    window.addEventListener('touchstart', tryPlay);

    return () => {
      window.removeEventListener('scroll', tryPlay);
      window.removeEventListener('touchstart', tryPlay);
    };
  }, []);

  return (
    <section
      id="casos"
      className="relative overflow-hidden py-20 md:py-24 bg-transparent"
    >
      {/* FONDO CON VIDEO (VA DETRÁS DE TODO) */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/videos/fondo1.mp4" type="video/mp4" />
        </video>

        {/* overlay suave encima del video */}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h2 className="h2 text-white mb-6 md:mb-8 drop-shadow-2xl">
          Herramientas para empresas
        </h2>

        <p className="text-base md:text-lg lg:text-xl text-white/95 max-w-3xl mx-auto mb-12 md:mb-14 drop-shadow-lg">
          Tips profesionales de marketing, preguntas frecuentes y recursos útiles después de tener tu página web.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <a
            href="/herramientas"
            className="bg-white/95 backdrop-blur p-7 md:p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all"
          >
            <b className="text-xl md:text-2xl block mb-3 text-gray-900">
              Tips de marketing digital
            </b>
            <p className="text-sm md:text-base text-gray-700">
              Estrategias que sí funcionan en 2025.
            </p>
          </a>

          <a
            href="/herramientas"
            className="bg-white/95 backdrop-blur p-7 md:p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all"
          >
            <b className="text-xl md:text-2xl block mb-3 text-gray-900">
              Preguntas frecuentes
            </b>
            <p className="text-sm md:text-base text-gray-700">
              Todo lo que necesitás saber después de lanzar tu web.
            </p>
          </a>

          <a
            href="/herramientas"
            className="bg-white/95 backdrop-blur p-7 md:p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all"
          >
            <b className="text-xl md:text-2xl block mb-3 text-gray-900">
              Recursos para empresas
            </b>
            <p className="text-sm md:text-base text-gray-700">
              Guías y herramientas prácticas que usamos con clientes.
            </p>
          </a>
        </div>

        <div className="mt-14 md:mt-16">
          <a
            href="/herramientas"
            className="btn primary text-sm md:text-base px-10 md:px-14 py-3.5 md:py-4"
          >
            Ver todas las herramientas →
          </a>
        </div>
      </div>
    </section>
  );
}

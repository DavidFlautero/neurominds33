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

    play(); // intento inmediato

    const tryOnInteraction = () => {
      if (video.getBoundingClientRect().top < window.innerHeight * 1.2) {
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
    <section id="casos" className="relative py-32 overflow-hidden">
      {/* VIDEO DE FONDO – ahora sí funciona en todos lados */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/fondo1.mp4" type="video/mp4" />
      </video>

      {/* Degradado sutil tipo Vision – se ve el video pero el texto queda perfecto */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 -z-10" />

      {/* CONTENIDO */}
      <div className="wrap surface reveal relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h2 className="h2 text-white mb-6">
          Herramientas para empresas
        </h2>

        <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
          Tips profesionales de marketing, preguntas frecuentes y recursos útiles después de tener tu página web.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <a
            href="/herramientas"
            className="group bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 p-10 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 border border-white/20"
          >
            <b className="text-2xl md:text-3xl block mb-4 text-gray-800 group-hover:text-black transition">
              Tips de marketing digital
            </b>
            <p className="text-gray-600 group-hover:text-gray-800 transition">
              Estrategias que sí funcionan en 2025
            </p>
          </a>

          <a
            href="/herramientas"
            className="group bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 p-10 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 border border-white/20"
          >
            <b className="text-2xl md:text-3xl block mb-4 text-gray-800 group-hover:text-black transition">
              Preguntas frecuentes
            </b>
            <p className="text-gray-600 group-hover:text-gray-800 transition">
              Todo lo que necesitás saber después de lanzar tu web
            </p>
          </a>

          <a
            href="/herramientas"
            className="group bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 p-10 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 border border-white/20"
          >
            <b className="text-2xl md:text-3xl block mb-4 text-gray-800 group-hover:text-black transition">
              Recursos para empresas
            </b>
            <p className="text-gray-600 group-hover:text-gray-800 transition">
              Guías y herramientas prácticas que usamos con clientes
            </p>
          </a>
        </div>

        <div className="mt-16">
          <a href="/herramientas" className="btn primary text-xl px-16 py-5">
            Ver todas las herramientas →
          </a>
        </div>
      </div>
    </section>
  );
}
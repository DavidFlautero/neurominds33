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
    const onInteract = () => {
      if (video.getBoundingClientRect().top < window.innerHeight * 1.5) {
        play();
        window.removeEventListener('scroll', onInteract);
        window.removeEventListener('touchstart', onInteract);
      }
    };
    window.addEventListener('scroll', onInteract);
    window.addEventListener('touchstart', onInteract);
    return () => {
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };
  }, []);

  return (
    <section id="casos" className="relative py-32 lg:py-40 overflow-hidden">
      {/* VIDEO DE FONDO – visible al 100% */}
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

      {/* Fondo oscuro muy sutil + blur leve → el video se ve y el texto destaca */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] -z-10" />

      {/* TODO EL CONTENIDO ENCIMA DEL VIDEO */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h2 className="h2 text-white mb-8 drop-shadow-2xl">
          Herramientas para empresas
        </h2>

        <p className="text-xl md:text-2xl text-gray-100 max-w-4xl mx-auto leading-relaxed drop-shadow-lg mb-16">
          Tips profesionales de marketing, preguntas frecuentes y recursos útiles después de tener tu página web.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <a
            href="/herramientas"
            className="group bg-white/95 backdrop-blur hover:bg-white transition-all duration-300 p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 border border-white/30"
          >
            <b className="text-3xl md:text-4xl block mb-4 text-gray-900 group-hover:text-black font-bold">
              Tips de marketing digital
            </b>
            <p className="text-lg text-gray-700 group-hover:text-black">
              Estrategias que sí funcionan en 2025
            </p>
          </a>

          <a
            href="/herramientas"
            className="group bg-white/95 backdrop-blur hover:bg-white transition-all duration-300 p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 border border-white/30"
          >
            <b className="text-3xl md:text-4xl block mb-4 text-gray-900 group-hover:text-black font-bold">
              Preguntas frecuentes
            </b>
            <p className="text-lg text-gray-700 group-hover:text-black">
              Todo lo que necesitás saber después de lanzar tu web
            </p>
          </a>

          <a
            href="/herramientas"
            className="group bg-white/95 backdrop-blur hover:bg-white transition-all duration-300 p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 border border-white/30"
          >
            <b className="text-3xl md:text-4xl block mb-4 text-gray-900 group-hover:text-black font-bold">
              Recursos para empresas
            </b>
            <p className="text-lg text-gray-700 group-hover:text-black">
              Guías y herramientas prácticas que usamos con clientes
            </p>
          </a>
        </div>

        <div className="mt-20">
          <a
            href="/herramientas"
            className="btn primary text-2xl px-20 py-7 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
          >
            Ver todas las herramientas →
          </a>
        </div>
      </div>
    </section>
  );
}
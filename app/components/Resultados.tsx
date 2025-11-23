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
    <section id="casos" className="relative py-32 overflow-hidden">
      {/* VIDEO EN Z-INDEX 0 (no -z-10) + fixed para que NUNCA lo tape nada */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/fondo1.mp4" type="video/mp4" />
      </video>

      {/* Contenido encima con z-10 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h2 className="h2 text-white mb-8 drop-shadow-2xl">
          Herramientas para empresas
        </h2>
        <p className="text-xl md:text-2xl text-white max-w-4xl mx-auto mb-16 drop-shadow-lg">
          Tips profesionales de marketing, preguntas frecuentes y recursos útiles después de tener tu página web.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <a href="/herramientas" className="bg-white/95 backdrop-blur p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all">
            <b className="text-3xl block mb-4">Tips de marketing digital</b>
            <p className="text-gray-700">Estrategias que sí funcionan en 2025</p>
          </a>
          <a href="/herramientas" className="bg-white/95 backdrop-blur p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all">
            <b className="text-3xl block mb-4">Preguntas frecuentes</b>
            <p className="text-gray-700">Todo lo que necesitás saber después de lanzar tu web</p>
          </a>
          <a href="/herramientas" className="bg-white/95 backdrop-blur p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all">
            <b className="text-3xl block mb-4">Recursos para empresas</b>
            <p className="text-gray-700">Guías y herramientas prácticas que usamos con clientes</p>
          </a>
        </div>

        <div className="mt-20">
          <a href="/herramientas" className="btn primary text-2xl px-20 py-7">
            Ver todas las herramientas →
          </a>
        </div>
      </div>
    </section>
  );
}
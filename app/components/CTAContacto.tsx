'use client';
import { useEffect, useRef } from 'react';

export default function CTAContacto() {
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
    <section id="contacto" className="relative py-32 lg:py-40 overflow-hidden">
      {/* VIDEO DE FONDO – ahora SÍ se ve perfecto */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/fondo3.mp4" type="video/mp4" />
      </video>

      {/* Overlay sutil – deja ver el video pero hace que el texto destaque */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 -z-10" />

      {/* CONTENIDO – letras y botones */}
      <div className="relative z-10 text-center px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl">
            Llevá tu empresa al siguiente nivel
          </h2>

          <p className="text-xl md:text-2xl lg:text-3xl text-gray-100 mt-8 max-w-3xl mx-auto font-light drop-shadow-lg">
            Contanos tu objetivo real y te enviamos propuesta técnica + presupuesto exacto en 48 h.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center mt-12 lg:mt-16">
            <button
              className="btn primary text-2xl lg:text-3xl px-16 lg:px-20 py-7 lg:py-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-bold"
              id="openModalBottom"
            >
              Hablar ahora
            </button>

            <a
              href="/login"
              className="btn text-2xl lg:text-3xl px-14 lg:px-18 py-7 lg:py-8 border-4 border-white hover:bg-white hover:text-black transition-all duration-300 font-bold backdrop-blur-sm"
            >
              Login / Panel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
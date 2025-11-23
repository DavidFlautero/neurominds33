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
    <section id="contacto" className="relative py-32 overflow-hidden">
      {/* VIDEO DE FONDO */}
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

      {/* Overlay sutil – el video se ve perfecto y el texto queda impecable */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* CONTENIDO – solo letras y botones */}
      <div className="relative z-10 text-center px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="h1 md:h1-lg text-white font-bold leading-tight">
            Llevá tu empresa al siguiente nivel
          </h2>

          <p className="text-xl md:text-2xl text-gray-100 mt-8 max-w-3xl mx-auto font-light">
            Contanos tu objetivo real y te enviamos propuesta técnica + presupuesto exacto en 48 h.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <button
              className="btn primary text-xl md:text-2xl px-16 py-7 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition"
              id="openModalBottom"
            >
              Hablar ahora
            </button>

            <a
              href="/login"
              className="btn text-xl md:text-2xl px-14 py-7 border-2 border-white hover:bg-white hover:text-black transition"
            >
              Login / Panel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
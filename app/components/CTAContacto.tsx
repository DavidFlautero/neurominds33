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
    <section
      id="contacto"
      className="relative overflow-hidden py-16 md:py-20 lg:py-24 bg-transparent"
    >
      {/* FONDO CON VIDEO */}
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
          <source src="/videos/fondo3.mp4" type="video/mp4" />
        </video>

        {/* overlay suave */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-snug">
            Llevá tu empresa al siguiente nivel
          </h2>

          <p className="mt-4 md:mt-5 text-sm md:text-base lg:text-lg text-gray-100 font-light">
            Contanos tu objetivo real y te enviamos propuesta técnica + presupuesto exacto en 48 h.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button
              className="btn primary text-sm md:text-base px-8 md:px-10 py-3 md:py-3.5 font-semibold shadow-xl hover:shadow-2xl"
              id="openModalBottom"
            >
              Hablar ahora
            </button>

            <a
              href="/login"
              className="btn text-sm md:text-base px-7 md:px-9 py-3 md:py-3.5 border border-white/70 hover:bg-white hover:text-black transition-all duration-200 font-semibold backdrop-blur-sm"
            >
              Login / Panel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

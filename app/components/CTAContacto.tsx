'use client';

import { useEffect, useRef } from 'react';

export default function CTAContacto() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intentar reproducir automáticamente
    const play = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay bloqueado → reproducir en la primera interacción
          const handleFirstInteraction = () => {
            video.play();
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
          };

          document.addEventListener('click', handleFirstInteraction);
          document.addEventListener('touchstart', handleFirstInteraction);
        });
      }
    };

    play();

    // Loop infinito controlado por JS
    const handleEnded = () => {
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <section id="contacto" aria-label="Contacto y CTA final" className="py-24 relative overflow-hidden">

      {/* Video de fondo controlado por JS */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        loop={false}
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-25"
      >
        <source src="/videos/fondo3.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <div className="wrap surface reveal text-center">
        <h2 className="h2 max-w-4xl mx-auto">
          Llevá tu empresa al siguiente nivel
        </h2>

        <p className="p mt-6 max-w-xl mx-auto text-xl">
          Contanos tu objetivo real y te enviamos propuesta técnica + presupuesto exacto en 48 h.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mt-10">
          <button className="btn primary text-lg px-12 py-5" id="openModalBottom">
            Hablar ahora
          </button>

          <a className="btn text-lg px-10 py-5" href="/login">
            Login / Panel
          </a>
        </div>
      </div>
    </section>
  );
}

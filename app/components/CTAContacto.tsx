'use client';

import { useEffect, useRef } from 'react';

export default function CTAContacto() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true as any;

    const play = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
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
    <section
      id="contacto"
      aria-label="Contacto y CTA final"
      className="py-24 relative overflow-hidden"
    >
      {/* VIDEO DE FONDO */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        autoPlay
        loop
        className="absolute inset-0 w-full h-full object-cover -z-20 opacity-30"
      >
        <source src="/videos/fondo3.mp4" type="video/mp4" />
      </video>

      {/* Overlay suave para contraste */}
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* CONTENIDO */}
      <div className="wrap surface reveal text-center relative z-10">
        <h2 className="h2 max-w-4xl mx-auto text-white">
          Llevá tu empresa al siguiente nivel
        </h2>

        <p className="p mt-6 max-w-xl mx-auto text-xl text-gray-100">
          Contanos tu objetivo real y te enviamos propuesta técnica + presupuesto exacto en 48 h.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mt-10">
          <button
            className="btn primary text-lg px-12 py-5"
            id="openModalBottom"
          >
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

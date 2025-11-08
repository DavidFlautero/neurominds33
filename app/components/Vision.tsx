'use client';

import { useEffect, useRef } from 'react';

export default function Vision() {
  const eyeRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = eyeRef.current;
    if (!v) return;

    // Fix autoplay en Safari/iOS
    v.muted = true;
    (v as any).playsInline = true;
    (v as any).webkitPlaysinline = true;

    const tryPlay = () => v.play().catch(() => {});
    tryPlay();

    const onScroll = () => {
      if (v.getBoundingClientRect().top < window.innerHeight * 0.8) {
        tryPlay();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section id="vision" className="relative isolate py-20 overflow-hidden">
      {/* === VIDEO DE FONDO FULL WIDTH === */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/energia-neuro33-poster.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/videos/energia-neuro33.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" /> {/* degradado sutil */}
      </div>

      {/* === CONTENIDO === */}
      <div className="wrap grid2 relative z-10">
        <div className="surface reveal bg-white/60 backdrop-blur-md border border-white/40 dark:bg-black/40">
          <h2 className="h2 text-black dark:text-white">Nuestra visión</h2>
          <p className="p text-black/80 dark:text-gray-200">
            Construimos sistemas que amplifican el negocio: diseño impecable, arquitectura robusta
            y automatización inteligente. Trabajamos como socios estratégicos.
          </p>
          <ul className="p text-black/80 dark:text-gray-300 mt-3 leading-relaxed">
            <li><b>Arquitectura</b> modular con integraciones seguras y rendimiento de clase mundial.</li>
            <li><b>Experiencia</b> clara y estética premium que convierte.</li>
            <li><b>Evolución</b> continua con métricas y roadmap compartido.</li>
          </ul>
        </div>

        {/* VIDEO DEL OJO */}
        <div className="relative rounded-2xl overflow-hidden border border-white/30 shadow-lg backdrop-blur-sm">
          <video
            ref={eyeRef}
            className="w-full h-full object-cover rounded-2xl"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/vision/ojo-poster.jpg"
          >
            <source src="/images/vision/ojo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

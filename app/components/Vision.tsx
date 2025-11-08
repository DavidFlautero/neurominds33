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
    <section id="vision" className="relative isolate py-28 overflow-hidden">
  {/* VIDEO DE FONDO */}
  <video
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    className="absolute inset-0 w-full h-full object-cover -z-10"
  >
    <source src="/videos/fondovision.mp4" type="video/mp4" />
  </video>
  {/* Degradado sutil para legibilidad */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 -z-10" />

  {/* CONTENIDO */}
  <div className="wrap grid2 relative z-10 text-white">
    <div className="space-y-3">
      <h2 className="h2 font-semibold text-white">Nuestra visión</h2>
      <p className="text-sm md:text-base text-gray-200 max-w-[500px]">
        Construimos sistemas que amplifican el negocio: diseño impecable, arquitectura robusta y automatización inteligente.
        Trabajamos como socios estratégicos.
      </p>
      <ul className="text-gray-300 space-y-1">
        <li><b>Arquitectura</b> modular con integraciones seguras y rendimiento de clase mundial.</li>
        <li><b>Experiencia</b> clara y estética premium que convierte.</li>
        <li><b>Evolución</b> continua con métricas y roadmap compartido.</li>
      </ul>
    </div>

    {/* Video del ojo */}
    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/20">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        poster="/images/vision/ojo-poster.jpg"
      >
        <source src="/images/vision/ojo.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/10" />
    </div>
  </div>
</section>

  );
}

'use client';

import { useEffect, useRef } from 'react';

export default function Socios() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    (video as any).playsInline = true;

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
  }, []);

  return (
    <section id="socios" className="relative isolate py-28 overflow-hidden">
      {/* VIDEO DE FONDO */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-20"
      >
        <source src="/videos/fondo2.mp4" type="video/mp4" />
      </video>

      {/* DEGRADADO SUAVE */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 -z-10" />

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-200">
          Socios · Revenue share · Equity
        </span>

        <h2 className="h2 mt-6 leading-tight">
          ¿Tu negocio ya factura pero la tecnología te está frenando el crecimiento?
        </h2>

        <p className="mt-4 text-2xl md:text-3xl font-medium text-gray-50">
          Nosotros ponemos todo el equipo técnico.<br />
          Vos seguís poniendo las ventas.
        </p>

        <p className="mt-4 text-lg text-gray-200 max-w-3xl mx-auto">
          Programa para negocios con tracción real que quieren un socio de producto y
          tecnología: vos liderás el negocio, nosotros construimos y escalamos la plataforma.
        </p>

        <p className="mt-3 text-sm text-gray-300">
          Modelo <b>revenue share</b> o <b>equity + fee reducido</b>, según el estadio del proyecto.
        </p>
        <p className="text-xs text-gray-400">
          Cupo limitado: máximo 3 proyectos activos por trimestre.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/socios"
            className="btn text-base md:text-lg px-8 md:px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/30"
          >
            Conocer el programa
          </a>

          <a
            href="#contacto"
            className="btn primary text-base md:text-lg px-10 md:px-12 py-4"
          >
            Postular mi proyecto
          </a>
        </div>
      </div>
    </section>
  );
}

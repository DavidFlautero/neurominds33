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
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/80 -z-10" />

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
          Nos sumamos como brazo de producto y tecnología en proyectos con tracción real:
          vos liderás el negocio, nosotros construimos y escalamos la plataforma.
        </p>

        <p className="mt-3 text-sm text-gray-300">
          Modelo <b>revenue share</b> o <b>equity + fee reducido</b>, según el estadio del proyecto.
        </p>
        <p className="text-xs text-gray-400">
          Cupo limitado: máximo 3 proyectos activos por trimestre.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contacto"
            className="btn primary text-base md:text-lg px-10 md:px-12 py-4"
          >
            Postular mi proyecto
          </a>
          <span className="text-xs md:text-sm text-gray-300">
            Respuesta con propuesta técnica en menos de 48 h.
          </span>
        </div>

        {/* CARDS ABAJO EN GRID */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 text-left">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
            <h3 className="text-lg font-semibold mb-3">Qué entregamos</h3>
            <ul className="text-gray-100 space-y-2 text-sm leading-relaxed">
              <li>• Sitio web a medida (e-commerce, dashboard, landing)</li>
              <li>• Apps nativas iOS y Android</li>
              <li>• Automatizaciones completas (stock, pagos, WhatsApp, CRM)</li>
              <li>• Integraciones con pagos, logística y analítica</li>
              <li>• IA, growth y soporte continuo</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
            <h3 className="text-lg font-semibold mb-3">Proceso</h3>
            <p className="text-gray-100 text-sm leading-relaxed">
              1. Videollamada de 40’ para entender negocio, métricas y riesgos.<br />
              2. Propuesta técnica + modelo económico en 48 h.<br />
              3. Kickoff en menos de 7 días con roadmap claro y tableros compartidos.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
            <h3 className="text-lg font-semibold mb-3">Requisitos mínimos</h3>
            <ul className="text-gray-100 space-y-2 text-sm leading-relaxed">
              <li>• Ventas recurrentes o tracción comprobable.</li>
              <li>• Fundador involucrado full-time en el proyecto.</li>
              <li>• Métricas compartidas (ventas, funnels, unit economics).</li>
              <li>• Decisión rápida: trabajamos con equipos que ejecutan.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

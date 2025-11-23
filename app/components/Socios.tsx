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
            document.removeEventListener('scroll', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
          };

          document.addEventListener('scroll', handleFirstInteraction);
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

      {/* DEGRADADO PARA LECTURA */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 -z-10" />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start text-white">
          
          {/* COLUMNA IZQUIERDA – MENSAJE PRINCIPAL */}
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-200">
              Socios · Revenue share · Equity
            </span>

            <div className="space-y-4">
              <h2 className="h2 font-semibold leading-tight">
                ¿Tu negocio ya factura pero la tecnología te está frenando el crecimiento?
              </h2>

              <p className="text-2xl md:text-3xl font-medium text-gray-50">
                Nosotros ponemos todo el equipo técnico.<br />
                Vos seguís poniendo las ventas.
              </p>

              <p className="text-lg text-gray-300 max-w-xl">
                Nos sumamos como brazo de producto y tecnología en proyectos que ya tienen tracción real:
                vos liderás el negocio, nosotros construimos y escalamos la plataforma.
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-300">
              <p>
                Modelo <b>revenue share</b> o <b>equity + fee reducido</b>, según el estadio del proyecto.
              </p>
              <p className="text-xs text-gray-400">
                Cupo limitado: máximo 3 proyectos activos por trimestre.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
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
          </div>

          {/* COLUMNA DERECHA – CARDS / DETALLE */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
              <h3 className="text-xl font-semibold mb-3">Qué entregamos</h3>
              <ul className="text-gray-200 space-y-2 text-sm leading-relaxed">
                <li>• Sitio web a medida (e-commerce, dashboard, landing)</li>
                <li>• Apps nativas iOS y Android</li>
                <li>• Automatizaciones completas (stock, pagos, WhatsApp, CRM)</li>
                <li>• Integraciones con pagos, logística y analítica</li>
                <li>• IA, growth y soporte continuo</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
              <h3 className="text-xl font-semibold mb-3">Proceso</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                1. Videollamada de 40’ para entender negocio, métricas y riesgos. <br />
                2. Propuesta técnica + modelo económico en 48 h. <br />
                3. Kickoff en menos de 7 días con roadmap claro y tableros compartidos.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
              <h3 className="text-xl font-semibold mb-3">Requisitos mínimos</h3>
              <ul className="text-gray-200 space-y-2 text-sm leading-relaxed">
                <li>• Ventas recurrentes o tracción comprobable.</li>
                <li>• Fundador involucrado full-time en el proyecto.</li>
                <li>• Métricas compartidas (ventas, funnels, unit economics).</li>
                <li>• Decisión rápida: trabajamos con equipos que ejecutan.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

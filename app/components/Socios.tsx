'use client';

import { useEffect, useRef } from 'react';

export default function Socios() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ajustes básicos de autoplay
    video.muted = true;
    video.playsInline = true as any;

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
    <section id="socios" className="relative py-24 min-h-screen overflow-hidden">
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

      {/* Overlay para legibilidad, pero sin tapar el video */}
      <div className="absolute inset-0 bg-black/55 -z-10" />

      {/* CONTENIDO */}
      <div className="wrap relative z-10">
        <div className="surface reveal bg-white/5 border border-white/10 rounded-3xl px-8 py-10 backdrop-blur">
          <h2 className="h2 text-center max-w-5xl mx-auto text-white">
            ¿Tu negocio ya factura pero la tecnología te está frenando el crecimiento?
          </h2>

          <p className="p text-center text-2xl mt-6 max-w-4xl mx-auto font-medium text-gray-100">
            Nosotros ponemos todo el equipo técnico.<br />
            Vos seguís poniendo las ventas.
          </p>

          <p className="text-center text-lg mt-4 text-gray-200 max-w-3xl mx-auto">
            Modelo revenue share o equity + fee reducido · Solo proyectos con tracción real.
          </p>

          <div className="grid3 mt-16 gap-10">
            <div className="card bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold mb-4">Qué entregamos</h3>
              <p className="p text-gray-700 leading-relaxed">
                • Sitio web a medida (e-commerce, dashboard, landing)<br />
                • Apps nativas iOS y Android<br />
                • Automatizaciones completas (stock, pagos, WhatsApp, CRM)<br />
                • IA, growth y soporte continuo.
              </p>
            </div>

            <div className="card bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold mb-4">Proceso</h3>
              <p className="p text-gray-700">
                Llamada de 40 minutos → propuesta técnica y económica en 48 h →
                inicio en menos de 7 días.
              </p>
            </div>

            <div className="card bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold mb-4">Requisitos</h3>
              <p className="p text-gray-700">
                • Ventas recurrentes o tracción comprobable<br />
                • Compromiso full-time del fundador<br />
                • Métricas 100 % transparentes.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              className="btn primary text-xl px-14 py-6"
              href="#contacto"
              id="openModalSocios"
            >
              Postular mi proyecto
            </a>
          </div>

          <p className="text-center text-sm text-gray-300 mt-6">
            Cupo limitado: máximo 3 proyectos por trimestre.
          </p>
        </div>
      </div>
    </section>
  );
}

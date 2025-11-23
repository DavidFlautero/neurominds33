'use client';

import { useEffect, useRef } from 'react';

export default function Socios() {
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
    <section id="socios" className="relative py-24 overflow-hidden">
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
        <source src="/videos/fondo2.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro sutil – ajustado para que se vea el video pero el texto brille */}
      <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* CONTENIDO */}
      <div className="wrap surface reveal relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2 className="h2 text-white mb-6">
            ¿Tu negocio ya factura pero la tecnología te está frenando el crecimiento?
          </h2>

          <p className="text-2xl md:text-3xl font-medium text-white mb-6">
            Nosotros ponemos todo el equipo técnico.<br className="hidden md:block" />
            Vos seguís poniendo las ventas.
          </p>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
            Modelo revenue share o equity + fee reducido · Solo proyectos con tracción real
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Qué entregamos</h3>
              <ul className="text-gray-700 space-y-2 leading-relaxed">
                <li>• Sitio web a medida (e-commerce, dashboard, landing)</li>
                <li>• Apps nativas iOS y Android</li>
                <li>• Automatizaciones completas (stock, pagos, WhatsApp, CRM)</li>
                <li>• IA, growth y soporte continuo</li>
              </ul>
            </div>

            <div className="card bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Proceso</h3>
              <p className="text-gray-700 leading-relaxed">
                Llamada de 40 minutos → propuesta técnica y económica en 48 h → inicio en menos de 7 días.
              </p>
            </div>

            <div className="card bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Requisitos</h3>
              <ul className="text-gray-700 space-y-2 leading-relaxed">
                <li>• Ventas recurrentes o tracción comprobable</li>
                <li>• Compromiso full-time del fundador</li>
                <li>• Métricas 100 % transparentes</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16">
            <a
              href="#contacto"
              id="openModalSocios"
              className="btn primary text-xl px-16 py-6 inline-block"
            >
              Postular mi proyecto
            </a>
            <p className="text-gray-400 text-sm mt-4">
              Cupo limitado: máximo 3 proyectos por trimestre
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
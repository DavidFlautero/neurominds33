'use client';

import { useEffect, useRef } from 'react';

export default function Socios() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Imprescindible para iOS y Android
    video.muted = true;
    video.playsInline = true;

    const playVideo = () => {
      video.play().catch(() => {
        // Silenciamos errores de autoplay (es normal en algunos móviles)
      });
    };

    // Intento inmediato
    playVideo();

    // Si no pudo al montar, lo intentamos cuando entre en pantalla
    const handleInteraction = () => {
      if (video.getBoundingClientRect().top < window.innerHeight * 1.2) {
        playVideo();
        window.removeEventListener('scroll', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
      }
    };

    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    <section id="socios" className="py-24 relative overflow-hidden">
      {/* VIDEO DE FONDO – ahora sí funciona */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-10"
        poster="/videos/fondo2-poster.jpg" // opcional: imagen de carga rápida
      >
        <source src="/videos/fondo2.mp4" type="video/mp4" />
        {/* Fallback por si el navegador no soporta video */}
        <div className="absolute inset-0 bg-black" />
      </video>

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Contenido */}
      <div className="wrap surface reveal relative z-10">
        <h2 className="h2 text-center max-w-5xl mx-auto">
          ¿Tu negocio ya factura pero la tecnología te está frenando el crecimiento?
        </h2>

        <p className="p text-center text-2xl mt-6 max-w-4xl mx-auto font-medium">
          Nosotros ponemos todo el equipo técnico.<br />
          Vos seguís poniendo las ventas.
        </p>

        <p className="text-center text-lg mt-4 text-gray-300 max-w-3xl mx-auto">
          Modelo revenue share o equity + fee reducido · Solo proyectos con tracción real
        </p>

        <div className="grid3 mt-16 gap-10">
          <div className="card bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold mb-4">Qué entregamos</h3>
            <p className="p text-gray-700 leading-relaxed">
              • Sitio web a medida (e-commerce, dashboard, landing)<br />
              • Apps nativas iOS y Android<br />
              • Automatizaciones completas (stock, pagos, WhatsApp, CRM)<br />
              • IA, growth y soporte continuo
            </p>
          </div>

          <div className="card bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold mb-4">Proceso</h3>
            <p className="p text-gray-700">
              Llamada de 40 minutos → propuesta técnica y económica en 48 h → inicio en menos de 7 días.
            </p>
          </div>

          <div className="card bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold mb-4">Requisitos</h3>
            <p className="p text-gray-700">
              • Ventas recurrentes o tracción comprobable<br />
              • Compromiso full-time del fundador<br />
              • Métricas 100 % transparentes
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

        <p className="text-center text-sm text-gray-400 mt-6">
          Cupo limitado: máximo 3 proyectos por trimestre
        </p>
      </div>
    </section>
  );
}
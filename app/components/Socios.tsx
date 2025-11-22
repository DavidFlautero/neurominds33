'use client';

import { useEffect, useRef } from 'react';

export default function Socios() {
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
    <section id="socios" className="py-24 relative overflow-hidden">
      {/* Video de fondo – autoplay + loop controlado por JS */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          loop={false} // lo controlamos a mano
        >
          <source src="/videos/fondo2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay oscuro para que el texto se lea bien */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

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

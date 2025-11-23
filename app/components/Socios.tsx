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

    const onInteract = () => {
      if (video.getBoundingClientRect().top < window.innerHeight * 0.9) {
        play();
        window.removeEventListener('scroll', onInteract);
        window.removeEventListener('touchstart', onInteract);
      }
    };

    window.addEventListener('scroll', onInteract);
    window.addEventListener('touchstart', onInteract);

    return () => {
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };
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
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/fondo2.mp4" type="video/mp4" />
      </video>
      {/* ↑↑↑ Aquí estaba el error: faltaba cerrar </video> */}

      {/* Degradado sutil solo en la izquierda – exactamente como Vision */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent -z-10" />

      {/* CONTENIDO */}
      <div className="wrap grid2 relative z-10 text-white max-w-7xl mx-auto px-6">
        {/* Texto a la izquierda */}
        <div className="space-y-8">
          <h2 className="h2 font-semibold leading-tight">
            ¿Tu negocio ya factura pero la tecnología te está frenando el crecimiento?
          </h2>

          <p className="text-2xl md:text-3xl font-medium">
            Nosotros ponemos todo el equipo técnico.<br />
            Vos seguís poniendo las ventas.
          </p>

          <p className="text-lg text-gray-300 max-w-xl">
            Modelo revenue share o equity + fee reducido · Solo proyectos con tracción real
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold mb-3">Qué entregamos</h3>
              <ul className="text-gray-200 space-y-2 text-sm leading-relaxed">
                <li>• Sitio web a medida (e-commerce, dashboard, landing)</li>
                <li>• Apps nativas iOS y Android</li>
                <li>• Automatizaciones completas</li>
                <li>• IA, growth y soporte continuo</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold mb-3">Proceso</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                Llamada de 40 minutos → propuesta en 48 h → inicio en menos de 7 días
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold mb-3">Requisitos</h3>
              <ul className="text-gray-200 space-y-2 text-sm leading-relaxed">
                <li>• Ventas recurrentes o tracción comprobable</li>
                <li>• Compromiso full-time del fundador</li>
                <li>• Métricas 100 % transparentes</li>
              </ul>
            </div>
          </div>

          <a
            href="#contacto"
            className="btn primary text-xl px-14 py-6 inline-block mt-10"
          >
            Postular mi proyecto
          </a>
          <p className="text-gray-400 text-sm mt-4">
            Cupo limitado: máximo 3 proyectos por trimestre
          </p>
        </div>

        {/* Video del ojo a la derecha (el mismo que usás en Vision) */}
       
      </div>
    </section>
  );
}
'use client';
import { useEffect, useRef } from 'react';

export default function Socios() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Crucial para iOS y Android
    video.muted = true;
    (video as any).playsInline = true;
    (video as any).webkitPlaysinline = true;

    const tryPlay = () => {
      video.play().catch(() => {
        // Si falla el autoplay directo, intentamos al hacer scroll o touch
      });
    };

    // Intento inmediato
    tryPlay();

    // Si no pudo, lo intentamos cuando entre en viewport
    const handleScrollOrTouch = () => {
      if (video.getBoundingClientRect().top < window.innerHeight * 0.9) {
        tryPlay();
        window.removeEventListener('scroll', handleScrollOrTouch);
        window.removeEventListener('touchstart', handleScrollOrTouch);
      }
    };

    window.addEventListener('scroll', handleScrollOrTouch);
    window.addEventListener('touchstart', handleScrollOrTouch); // importante para móviles

    return () => {
      window.removeEventListener('scroll', handleScrollOrTouch);
      window.removeEventListener('touchstart', handleScrollOrTouch);
    };
  }, []);

  return (
    <section id="socios" className="py-24 relative overflow-hidden">
      {/* VIDEO DE FONDO */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/fondo2.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Todo tu contenido actual (sin cambios) */}
      <div className="wrap surface reveal relative z-10">
        {/* ... el resto de tu JSX exactamente igual ... */}
        <h2 className="h2 text-center max-w-5xl mx-auto">
          ¿Tu negocio ya factura pero la tecnología te está frenando el crecimiento?
        </h2>
        {/* ... etc ... */}
      </div>
    </section>
  );
}
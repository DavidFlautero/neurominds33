'use client';
import { useEffect, useRef } from 'react';

export default function CTAContacto() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const play = () => video.play().catch(() => {});

    play(); // intento inmediato

    const tryOnScrollOrTouch = () => {
      if (video.getBoundingClientRect().top < window.innerHeight * 1.5) {
        play();
        window.removeEventListener('scroll', tryOnScrollOrTouch);
        window.removeEventListener('touchstart', tryOnScrollOrTouch);
      }
    };

    window.addEventListener('scroll', tryOnScrollOrTouch);
    window.addEventListener('touchstart', tryOnScrollOrTouch);

    return () => {
      window.removeEventListener('scroll', tryOnScrollOrTouch);
      window.removeEventListener('touchstart', tryOnScrollOrTouch);
    };
  }, []);

  return (
    <section id="contacto" className="relative h-screen">
      {/* SOLO EL VIDEO – NADA MÁS EN EL MUNDO */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/fondo3.mp4" type="video/mp4" />
      </video>

      {/* TODO LO DEMÁS BORRADO PARA QUE VEAS QUE EL VIDEO SÍ ESTÁ Y SE VE PERFECTO */}
      {/* Cuando me digas “ahora sí se ve el video”, te paso la versión final con las letras encima */}
    </section>
  );
}
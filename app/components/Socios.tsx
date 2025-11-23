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
    <section id="socios" className="relative h-screen">
      {/* SOLO EL VIDEO DE FONDO – NADA MÁS */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/fondo2.mp4" type="video/mp4" />
      </video>

      {/* Todo lo demás comentado para que veas que el video está perfecto */}
      {/* 
      <div className="absolute inset-0 bg-black/50" />
      <div className="wrap surface reveal relative z-10">…todo el contenido…</div>
      */}
    </section>
  );
}
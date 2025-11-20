// app/components/Servicios.tsx
'use client';

import { useEffect, useRef } from 'react';

// Actualizar el tipo del ref para aceptar null
function useSlowPlayback(ref: React.RefObject<HTMLVideoElement | null>, rate = 0.8) {
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    
    const setRate = () => {
      if (v) {
        v.playbackRate = rate;
      }
    };

    v.addEventListener('loadedmetadata', setRate);
    v.addEventListener('canplay', setRate);
    v.addEventListener('playing', setRate);
    
    // Manejar el error de autoplay silenciosamente
    v.play().catch(() => {});

    return () => {
      v.removeEventListener('loadedmetadata', setRate);
      v.removeEventListener('canplay', setRate);
      v.removeEventListener('playing', setRate);
    };
  }, [ref, rate]);
}

// El resto del código permanece igual...
function CardVideo({
  webm,
  mp4,
  poster,
  alt,
}: {
  webm: string;
  mp4: string;
  poster: string;
  alt: string;
}) {
  const vRef = useRef<HTMLVideoElement>(null);
  useSlowPlayback(vRef, 0.85);

  return (
    <div className="card-media">
      <video
        ref={vRef}
        className="card-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-label={alt}
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
      {/* Fallback por si el navegador bloquea todo */}
      <noscript>
        <img src={poster} alt={alt} />
      </noscript>
    </div>
  );
}

export default function Servicios() {
  // fondo de toda la sección
  const bgRef = useRef<HTMLVideoElement>(null);
  useSlowPlayback(bgRef, 0.8);

  return (
    <section id="servicios" className="relative isolate py-20 overflow-hidden">
      {/* === Fondo “ondas” a todo el ancho === */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <video
          ref={bgRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/ondas_poster.jpg"
        >
          <source src="/videos/ondas_vp9.webm?v=2" type="video/webm" />
          <source src="/videos/ondas_h264.mp4?v=2" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.1)_40%,rgba(0,0,0,.2))]" />
      </div>

      <div className="wrap">
        <div className="grid3">
          {/* Tienda Online */}
          <article className="card reveal">
            <CardVideo
              webm="/videos/serv_tienda_vp9.webm?v=1"
              mp4="/videos/serv_tienda_h264.mp4?v=1"
              poster="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop"
              alt="Tienda Online"
            />
            <h3>Tienda Online</h3>
            <p className="p">
              Catálogo, checkout, cuotas y logística. Integración con Mercado Pago y panel del cliente.
            </p>
            <a className="btn" href="/tiendas">Ver Tiendas →</a>
          </article>

          {/* Automatización */}
          <article className="card reveal">
            <CardVideo
              webm="/videos/serv_auto_vp9.webm?v=1"
              mp4="/videos/serv_ia_h266.mp4?v=1"
              poster="https://images.unsplash.com/photo-1551281044-8c5200d3d043?q=80&w=1600&auto=format&fit=crop"
              alt="Automatización"
            />
            <h3>Automatización</h3>
            <p className="p">
              Procesos repetitivos, ERP/CRM, WhatsApp y dashboards. Menos fricción, más ROI.
            </p>
            <a className="btn" href="/automatizacion">Ver Automatización →</a>
          </article>

          {/* Agentes IA */}
          <article className="card reveal">
            <CardVideo
              webm="/videos/serv_ia_vp9.webm?v=1"
              mp4="/videos/serv_ia_h264.mp4?v=1"
              poster="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop"
              alt="Agentes IA"
            />
            <h3>Agentes IA</h3>
            <p className="p">
              Ventas, soporte y operaciones con RAG y datos internos. Integración multicanal.
            </p>
            <a className="btn" href="/ia">Ver IA →</a>
          </article>
        </div>
      </div>
    </section>
  );
}
'use client';

import { useEffect, useRef } from 'react';

export default function Proceso() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true as any;

    const play = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
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
    <section
      id="proceso"
      className="py-24 relative overflow-hidden"
    >
      {/* VIDEO DE FONDO */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-20 opacity-30"
      >
        <source src="/videos/fondo2.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY SUAVE PARA CONTRASTE */}
      <div className="absolute inset-0 bg-black/35 -z-10" />

      {/* CONTENIDO */}
      <div className="wrap grid2 relative z-10">
        <div className="surface reveal">
          <h2 className="h2">Proceso de trabajo</h2>
          <ol className="p" style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
            <li><b>Videollamada 40’</b> — objetivos, alcance, riesgos.</li>
            <li><b>Propuesta y contrato</b> — hitos, entregables, cronograma.</li>
            <li><b>Pago</b> — link seguro (Mercado Pago) o transferencia.</li>
            <li><b>Ejecución + Panel del cliente</b> — progreso, archivos y pruebas.</li>
          </ol>
          <p className="p" style={{ marginTop: 8 }}>
            Sin lista de precios: estimamos por complejidad e impacto.
          </p>
        </div>

        <div className="surface reveal" aria-label="Clientes y partners">
          <h2 className="h2">Confían equipos que valoran diseño y ejecución</h2>
          <div
            style={{
              display: 'flex',
              gap: 28,
              flexWrap: 'wrap',
              alignItems: 'center',
              opacity: 0.9,
              marginTop: 6,
            }}
          >
            <img src="https://dummyimage.com/120x28/ddd/555&text=Logo+1" alt="Cliente 1" height={28} />
            <img src="https://dummyimage.com/120x28/ddd/555&text=Logo+2" alt="Cliente 2" height={28} />
            <img src="https://dummyimage.com/120x28/ddd/555&text=Logo+3" alt="Cliente 3" height={28} />
            <img src="https://dummyimage.com/120x28/ddd/555&text=Logo+4" alt="Cliente 4" height={28} />
            <img src="https://dummyimage.com/120x28/ddd/555&text=Logo+5" alt="Cliente 5" height={28} />
          </div>
        </div>
      </div>
    </section>
  );
}

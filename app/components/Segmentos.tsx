export default function SoftwareMedida() {
  return (
    <section
      id="software-medida"
      className="relative overflow-hidden py-20"
    >
      {/* VIDEO DE FONDO */}
      <video
        src="/videos/softwaremedida.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Degradado para que el texto se lea (más fuerte del lado derecho) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10 -z-10" />

      {/* CONTENIDO */}
      <div className="wrap relative">
        <div className="grid2 items-center gap-12">
          {/* IZQUIERDA: IMAGEN – MISMA LÓGICA QUE EL OJO (CARD, PROPORCIÓN CONTROLADA) */}
          <div className="reveal">
            <div className="nm-service-image-wrapper">
              <img
                src="/images/softwareMedida/empresas2.png"
                alt="Dashboard de software a medida para empresas"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* DERECHA: TEXTO */}
          <div className="reveal text-white space-y-4 max-w-xl">
            <p className="eyebrow text-white/70">Software a medida</p>

            <h2 className="h2 text-white">
              Sistemas diseñados para tu negocio
            </h2>

            <p className="p text-white/85">
              Construimos plataformas a medida con enfoque en escalabilidad,
              seguridad e integración. Paneles internos, automatizaciones y
              dashboards que se adaptan a cómo realmente trabaja tu equipo.
            </p>

            <p className="p text-white/80">
              Sin plantillas genéricas ni soluciones forzadas: partimos de tus
              procesos y objetivos para definir una arquitectura clara y lista
              para crecer.
            </p>

            <a href="/empresas" className="btn primary mt-4">
              Hablar sobre un proyecto →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SoftwareMedida() {
  return (
    <section
      id="software-medida"
      className="relative overflow-hidden py-16 md:py-20 bg-transparent"
    >
      {/* FONDO: VIDEO + DEGRADADO */}
      <div className="absolute inset-0">
        <video
          src="/videos/softwaremedida.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Degradado para legibilidad (encima del video) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
      </div>

      {/* CONTENIDO */}
      <div className="wrap relative z-10">
        <div className="grid2 items-center gap-10">
          {/* IZQUIERDA: IMAGEN MÁS BAJA / PANORÁMICA */}
          <div className="reveal flex justify-center">
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black/40">
              <img
                src="/images/softwareMedida/empresas2.png"
                alt="Dashboard de software a medida para empresas"
                className="absolute inset-0 w-full h-full object-cover"
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

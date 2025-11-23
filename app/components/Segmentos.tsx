export default function SoftwareMedida() {
  return (
    <section
      id="software-medida"
      className="relative overflow-hidden"
    >
      {/* VIDEO DE FONDO: ESTE ES /videos/softwaremedida.mp4 */}
      <video
        src="/videos/softwaremedida.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Capa para que se lean las letras, pero más suave para que se vea el video */}
      <div className="absolute inset-0 bg-black/20" />

      {/* CONTENIDO ENCIMA */}
      <div className="relative wrap py-20">
        <div className="grid2 items-center gap-10">
          {/* IZQUIERDA: IMAGEN (empresas2) */}
          <div className="reveal">
            <img
              src="/images/softwareMedida/empresas2.png"
              alt="Dashboard de software a medida para empresas"
              className="w-full max-w-xl rounded-3xl shadow-xl"
            />
          </div>

          {/* DERECHA: TEXTO */}
          <div className="reveal">
            <p className="eyebrow text-white/70">Software a medida</p>
            <h2 className="h2 text-white">Sistemas diseñados para tu negocio</h2>

            <p className="p text-white/85">
              Construimos plataformas a medida con enfoque en escalabilidad, seguridad e integración.
              Paneles internos, automatizaciones y dashboards que se adaptan a cómo realmente trabaja tu equipo.
            </p>
            <p className="p text-white/80">
              Sin plantillas genéricas ni soluciones forzadas: partimos de tus procesos y objetivos
              para definir una arquitectura clara y lista para crecer.
            </p>

            <a href="/empresas" className="btn mt-4">
              Hablar sobre un proyecto →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

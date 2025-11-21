export default function SoftwareMedida() {
  return (
    <section
      id="software-medida"
      className="relative overflow-hidden"
    >
      {/* VIDEO DE FONDO */}
      <video
        src="/videos/softwaremedida.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      {/* CAPA SUAVE PARA QUE SE LEA EL TEXTO */}
      <div className="absolute inset-0 bg-black/25" />

      {/* CONTENIDO ENCIMA DEL VIDEO */}
      <div className="relative wrap py-20">
        <div className="surface">
          <div className="grid2 items-center gap-10">
            {/* IZQUIERDA: IMAGEN (como el ojo pero del otro lado) */}
            <div className="reveal">
              <img
                src="/images/softwaremedida/empresas2.png"
                alt="Dashboard de software a medida para empresas"
                className="w-full max-w-xl rounded-3xl shadow-xl"
              />
            </div>

            {/* DERECHA: TEXTO (estilo 'Nuestra visión', pero hablando de software a medida) */}
            <div className="reveal">
              <p className="eyebrow">Software a medida</p>
              <h2 className="h2">Sistemas diseñados para tu negocio</h2>

              <p className="p">
                Construimos plataformas a medida con enfoque en escalabilidad, seguridad e
                integración. Paneles internos, automatizaciones y dashboards que se adaptan
                a cómo realmente trabaja tu equipo.
              </p>

              <p className="p">
                Sin plantillas genéricas ni soluciones forzadas: partimos de tus procesos y
                objetivos para definir una arquitectura clara y lista para crecer.
              </p>

              <a href="/empresas" className="btn mt-4">
                Hablar sobre un proyecto →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

export default function Socios() {
  return (
    <section id="socios" className="py-24 relative overflow-hidden">
      {/* Video de fondo – mismo patrón que Vision */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/fondo2.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro para que el texto se lea bien */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <div className="wrap surface reveal relative z-10">
        <h2 className="h2 text-center max-w-5xl mx-auto">
          ¿Tu negocio ya factura pero la tecnología te está frenando el crecimiento?
        </h2>

        <p className="p text-center text-2xl mt-6 max-w-4xl mx-auto font-medium">
          Nosotros ponemos todo el equipo técnico.<br />
          Vos seguís poniendo las ventas.
        </p>

        <p className="text-center text-lg mt-4 text-gray-300 max-w-3xl mx-auto">
          Modelo revenue share o equity + fee reducido · Solo proyectos con tracción real
        </p>

        <div className="grid3 mt-16 gap-10">
          <div className="card bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold mb-4">Qué entregamos</h3>
            <p className="p text-gray-700 leading-relaxed">
              • Sitio web a medida (e-commerce, dashboard, landing)<br />
              • Apps nativas iOS y Android<br />
              • Automatizaciones completas (stock, pagos, WhatsApp, CRM)<br />
              • IA, growth y soporte continuo
            </p>
          </div>

          <div className="card bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold mb-4">Proceso</h3>
            <p className="p text-gray-700">
              Llamada de 40 minutos → propuesta técnica y económica en 48 h → inicio en menos de 7 días.
            </p>
          </div>

          <div className="card bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold mb-4">Requisitos</h3>
            <p className="p text-gray-700">
              • Ventas recurrentes o tracción comprobable<br />
              • Compromiso full-time del fundador<br />
              • Métricas 100 % transparentes
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            className="btn primary text-xl px-14 py-6"
            href="#contacto"
            id="openModalSocios"
          >
            Postular mi proyecto
          </a>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Cupo limitado: máximo 3 proyectos por trimestre
        </p>
      </div>
    </section>
  );
}

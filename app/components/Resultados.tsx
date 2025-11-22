export default function Resultados() {
  return (
    <section id="casos" className="relative py-24 overflow-hidden">
      {/* Video de fondo – igual que en tu hero */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-30"
      >
        <source src="/video-bg.mp4" type="video/mp4" />  {/* Cambiá por tu video real */}
      </video>

      {/* Overlay oscuro para que se lea bien el texto */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      <div className="wrap surface reveal relative z-10">
        <h2 className="h2 text-center">Herramientas para empresas</h2>
        <p className="p text-center mt-6 max-w-3xl mx-auto text-lg">
          Tips profesionales de marketing, preguntas frecuentes y recursos útiles después de tener tu página web.
        </p>

        <div className="grid2 mt-16 gap-8">

          <a 
            href="/herramientas" 
            className="kpi bg-white/95 backdrop-blur hover:bg-white transition-all duration-300 text-left p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <b className="text-2xl block mb-3">Tips de marketing digital</b>
            <span className="p text-gray-600">Estrategias que sí funcionan en 2025</span>
          </a>

          <a 
            href="/herramientas" 
            className="kpi bg-white/95 backdrop-blur hover:bg-white transition-all duration-300 text-left p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <b className="text-2xl block mb-3">Preguntas frecuentes</b>
            <span className="p text-gray-600">Todo lo que necesitás saber después de lanzar tu web</span>
          </a>

          <a 
            href="/herramientas" 
            className="kpi bg-white/95 backdrop-blur hover:bg-white transition-all duration-300 text-left p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <b className="text-2xl block mb-3">Recursos para empresas</b>
            <span className="p text-gray-600">Guías y herramientas prácticas que usamos con clientes</span>
          </a>

        </div>

        <div className="text-center mt-12">
          <a href="/herramientas" className="btn">
            Ver todas las herramientas →
          </a>
        </div>
      </div>
    </section>
  );
}
export default function CTAContacto() {
  return (
    <section id="contacto" aria-label="Contacto y CTA final" className="py-24 relative overflow-hidden">
      {/* Video de fondo forzado – igual que todas las secciones */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-25"
      >
        <source src="/videos/fondo3.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50 -z-10"></div>

      <div className="wrap surface reveal" style={{ textAlign: "center" }}>
        <h2 className="h2 max-w-4xl mx-auto">
          Llevá tu empresa al siguiente nivel
        </h2>

        <p className="p" style={{ maxWidth: 720, margin: "20px auto 32px", fontSize: "1.25rem" }}>
          Contanos tu objetivo real y te enviamos propuesta técnica + presupuesto exacto en 48 h.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn primary text-lg px-12 py-5" id="openModalBottom">
            Hablar ahora
          </button>
          <a className="btn text-lg px-10 py-5" href="/login">
            Login / Panel
          </a>
        </div>
      </div>
    </section>
  );
}
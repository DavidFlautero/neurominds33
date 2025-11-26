// app/tiendas-online/page.tsx
import Link from "next/link";

export default function TiendasOnlinePage() {
  return (
    <main className="min-h-[70vh] bg-slate-950 text-white">
      <section className="wrap py-16">
        {/* Eyebrow */}
        <p className="text-xs sm:text-sm text-blue-300 mb-2 uppercase tracking-[0.15em]">
          Servicio · E-commerce profesional
        </p>

        {/* Título principal */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Tiendas online que venden de verdad.
        </h1>

        {/* Intro */}
        <p className="text-base sm:text-lg text-slate-200 max-w-2xl mb-8">
          Diseñamos y lanzamos tu canal de ventas online con catálogo, checkout,
          cuotas, integración con Mercado Pago y panel para que administres tus
          productos y pedidos sin volverte loco.
        </p>

        {/* Dos columnas: qué incluye / para quién es */}
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">¿Qué incluye?</h2>
            <ul className="list-disc list-inside text-slate-200 space-y-1 text-sm sm:text-base">
              <li>Diseño profesional adaptado a tu marca.</li>
              <li>Catálogo con filtros, variantes y buscador.</li>
              <li>Checkout optimizado para conversión.</li>
              <li>Integración con Mercado Pago y otros medios de pago.</li>
              <li>Gestión de pedidos, clientes y stock.</li>
              <li>Capacitación básica para que la puedas manejar.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Ideal para</h2>
            <ul className="list-disc list-inside text-slate-200 space-y-1 text-sm sm:text-base">
              <li>Negocios que ya venden por WhatsApp o Instagram.</li>
              <li>Locales físicos que quieren sumar canal online.</li>
              <li>Marcas que necesitan algo más serio que un link de pago.</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="https://wa.me/54911TU_NUMERO?text=Hola%2C+vi+el+servicio+de+tiendas+online+de+NeuroMind33+y+quiero+mas+info."
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold text-white transition shadow-lg hover:shadow-xl"
          >
            Hablemos por WhatsApp
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-300 hover:text-white underline-offset-4 hover:underline"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}

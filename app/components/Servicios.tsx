export default function Servicios(){
  return (
    <section id="servicios">
      <div className="wrap">
        <div className="grid3">
          <article className="card reveal">
            <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop" alt="Tiendas Online" />
            <h3>Tienda Online</h3>
            <p className="p">Catálogo, checkout, cuotas y logística. Integración con Mercado Pago y panel del cliente.</p>
            <a className="btn" href="/tiendas">Ver Tiendas →</a>
          </article>
          <article className="card reveal">
            <img src="https://images.unsplash.com/photo-1551281044-8c5200d3d043?q=80&w=1600&auto=format&fit=crop" alt="Automatización" />
            <h3>Automatización</h3>
            <p className="p">Procesos repetitivos, ERP/CRM, WhatsApp y dashboards. Menos fricción, más ROI.</p>
            <a className="btn" href="/automatizacion">Ver Automatización →</a>
          </article>
          <article className="card reveal">
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop" alt="Agentes IA" />
            <h3>Agentes IA</h3>
            <p className="p">Ventas, soporte y operaciones con RAG y datos internos. Integración multicanal.</p>
            <a className="btn" href="/ia">Ver IA →</a>
          </article>
        </div>
      </div>
    </section>
  );
}

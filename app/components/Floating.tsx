"use client";
import { useEffect } from "react";

export default function Floating(){
  useEffect(() => {
    // Reveal on scroll
    const io = new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

    // Modal
    const modal = document.getElementById('leadModal');
    const add = (id:string) => document.getElementById(id)?.addEventListener('click',(e)=>{e.preventDefault(); modal?.classList.add('show')});
    ['openModalTop','openModalBottom','openModalBanner','openModalSocios'].forEach(add);
    document.getElementById('closeModal')?.addEventListener('click', ()=> modal?.classList.remove('show'));
    modal?.addEventListener('click', (e)=>{ if(e.target===modal) modal.classList.remove('show'); });

    // Form
    const form = document.getElementById('leadForm') as HTMLFormElement | null;
    form?.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      try{ fetch('/api/leads',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}).catch(()=>{});}catch{}
      const origin = encodeURIComponent(location.pathname);
      const txt = encodeURIComponent(
        `Hola NeuroMind33, llegué desde ${origin}.
Soy ${data['nombre']} de ${data['empresa']||'—'}.
Proyecto: ${data['tipo']} · Urgencia: ${data['urgencia']}
Presupuesto: ${data['presupuesto']||'—'} · Deadline: ${data['deadline']||'—'}
Detalle: ${data['detalle']||'—'}
Email: ${data['email']} · WhatsApp: ${data['whatsapp']}`
      );
      window.location.href = `https://wa.me/5491168322437?text=${txt}&utm_source=site&utm_medium=wa_float&utm_campaign=lead`;
    });

    // Auto-open once after 60% scroll
    if(!sessionStorage.getItem('lead_opened')){
      const onScroll = () => {
        const scrolled = window.scrollY / (document.body.scrollHeight - innerHeight);
        if(scrolled > 0.6){
          modal?.classList.add('show');
          sessionStorage.setItem('lead_opened','1');
          window.removeEventListener('scroll', onScroll);
        }
      };
      window.addEventListener('scroll', onScroll, {passive:true});
    }
  }, []);

  return (
    <>
      <a className="quick" id="openModalFloat" href="#contacto" aria-label="Abrir formulario rápido">📩 Hablar ahora</a>
      <a className="wa" href="https://wa.me/54911XXXXXXXX?text=Hola%20NeuroMind33" aria-label="WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M20.52 3.48A11.84 11.84 0 0012.14 0C6.3 0 1.89 4.41 1.89 9.84c0 1.76.45 3.45 1.3 4.97l-1.37 5.02 5.16-1.35a11.84 11.84 0 004.94 1.16c5.43 0 9.84-4.41 9.84-9.84 0-3.09-1.34-6-3.48-8.32z"/></svg>
      </a>

      {/* Modal */}
      <div className="modal" id="leadModal" aria-hidden="true" role="dialog" aria-label="Formulario de contacto">
        <div className="modal-card">
          <h3>Contanos tu proyecto</h3>
          <p className="p">Respondemos en 24–48 h con una propuesta preliminar.</p>
          <form id="leadForm" className="form">
            <div className="row">
              <input className="input" name="nombre" placeholder="Nombre y apellido" required />
              <input className="input" type="email" name="email" placeholder="Email" required />
            </div>
            <div className="row">
              <input className="input" name="empresa" placeholder="Empresa" />
              <input className="input" name="whatsapp" placeholder="WhatsApp (+54 9 ...)" required />
            </div>
            <div className="row">
              <select className="input" name="tipo">
                <option>Automatización de procesos</option>
                <option>Agentes IA</option>
                <option>Tienda Bagisto</option>
                <option>Integraciones / DevOps</option>
              </select>
              <select className="input" name="urgencia">
                <option>Exploratorio</option>
                <option>Arrancar este mes</option>
                <option>Arrancar esta semana</option>
              </select>
            </div>
            <div className="row">
              <select className="input" name="presupuesto">
                <option value="">Rango de presupuesto (opcional)</option>
                <option>&lt; 2.000 USD</option><option>2.000–5.000</option>
                <option>5.000–10.000</option><option>&gt; 10.000</option>
              </select>
              <select className="input" name="deadline">
                <option value="">Deadline</option>
                <option>Esta semana</option><option>Este mes</option><option>Próximo trimestre</option>
              </select>
            </div>
            <textarea className="input" name="detalle" placeholder="Contanos alcance, integraciones y objetivos..."></textarea>
            <div className="modal-actions">
              <button type="button" className="btn" id="closeModal">Cancelar</button>
              <button type="submit" className="btn primary">Enviar y abrir WhatsApp</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

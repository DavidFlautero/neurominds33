'use client';

import { useEffect } from 'react';
import '../globals.css';
import './automatizaciones.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ====== WHATSAPP HELPERS ====== */
const WHATSAPP_NUMBER = '541168322437'; // mismo número

const messages = {
  consulta:
    'Hola, me gustaría agendar una consulta gratuita sobre las soluciones de automatización de NeuroMind33 (domótica, procesos y bots).',
};

function getWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function AutomatizacionesPage() {
  useEffect(() => {
    // Smooth scrolling para anchors internos
    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const onClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    anchors.forEach((a) => a.addEventListener('click', onClick));

    // Animaciones de scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    });

    document
      .querySelectorAll<HTMLElement>('.plan-card, .solution-card, .guarantee-item')
      .forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });

    return () => {
      anchors.forEach((a) => a.removeEventListener('click', onClick));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />

      {/* MAIN con fondo global de estrellas o el que uses */}
      <main className="automation-page">
        {/* HERO */}
        <section className="hero">
          <div className="hero-overlay" />
          <div className="container hero-inner">
            <div className="hero-tag">
              <span>NEUROMIND33 · SOLUCIONES CON AUTOMATIZACIÓN</span>
            </div>

            <h1 className="hero-title">
              Hacemos que Tu Casa y Tu Empresa Trabajen Solas
            </h1>

            <p className="hero-subtitle">
              Integramos domótica, software e inteligencia artificial para automatizar tareas,
              procesos y sistemas. Desde prender luces y controlar accesos hasta bots que
              eliminan trabajo manual en tu negocio.
            </p>

            <div className="hero-badges">
              <div className="payment-badge">
                <i className="fas fa-bolt" /> Proyectos{' '}
                <strong>diseñados a medida</strong> según tu realidad
              </div>
              <div className="local-badge">
                <i className="fas fa-map-marker-alt" /> Pensado para PYMES, comercios y hogares
                en Latinoamérica
              </div>
            </div>

            <div className="hero-buttons">
              <a href="#planes" className="cta-button btn-primary">
                Quiero Automatizar Mi Mundo
              </a>
              <a href="#domotica" className="cta-button btn-secondary">
                Ver Qué Podemos Automatizar
              </a>
            </div>
          </div>
        </section>

        {/* INTRO SOLUCIONES CON AUTOMATIZACIÓN */}
        <section id="soluciones" className="section-compact">
          <div className="container">
            <div className="section-card solution-card">
              <div className="section-header">
                <h2>Soluciones con Automatización para Hogares, Negocios y Empresas</h2>
                <p>
                  No vendemos gadgets sueltos ni scripts aislados. Diseñamos sistemas completos
                  que conectan hardware, software e IA para reducir tiempos, eliminar tareas
                  repetitivas y darte control total desde una app o un panel web.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DOMÓTICA / HOGAR INTELIGENTE */}
        <section id="domotica" className="section-compact">
          <div className="container">
            <div className="section-card solution-card">
              <div className="section-header">
                <h2>Domótica y Hogares Inteligentes</h2>
                <p>
                  Convertimos tu casa en un espacio inteligente: luces, clima, seguridad y
                  escenas automáticas que se adaptan a tu día a día.
                </p>
              </div>
              <div className="solutions-grid">
                <div className="solution-item">
                  <h3>Control Total desde tu Celular</h3>
                  <p>
                    Prendé y apagá luces, aire acondicionado, cortinas y portones desde una app
                    o panel web. Escenas como “modo noche”, “modo vacaciones” o “todo apagado”
                    en un solo toque.
                  </p>
                </div>
                <div className="solution-item">
                  <h3>Seguridad Inteligente</h3>
                  <p>
                    Cámaras, timbres inteligentes, sensores de movimiento y apertura, alarmas
                    conectadas a tu celular con notificaciones en tiempo real.
                  </p>
                </div>
                <div className="solution-item">
                  <h3>Automatización de Rutinas</h3>
                  <p>
                    Programá horarios, reglas y escenas: luces que se prenden solas al
                    anochecer, clima que se ajusta según la temperatura o alarmas que se activan
                    cuando salís.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEGOCIOS / EMPRESAS FÍSICAS */}
        <section id="negocios" className="section-compact">
          <div className="container">
            <div className="section-card solution-card">
              <div className="section-header">
                <h2>Negocios Inteligentes y Automatización Física</h2>
                <p>
                  Ideal para locales, gimnasios, depósitos, oficinas y PYMES que quieren más
                  control, menos consumo y procesos más claros.
                </p>
              </div>
              <div className="solutions-grid">
                <div className="solution-item">
                  <h3>Luces, Cartelería y Energía Automática</h3>
                  <p>
                    Encendido y apagado automático según horarios, sensores o presencia.
                    Ahorro energético sin que nadie tenga que acordarse de apagar nada.
                  </p>
                </div>
                <div className="solution-item">
                  <h3>Control de Accesos y Seguridad</h3>
                  <p>
                    Acceso con QR o tarjetas, cámaras, alarmas inteligentes y registros de
                    entrada/salida para empleados, proveedores y clientes.
                  </p>
                </div>
                <div className="solution-item">
                  <h3>Monitoreo y Panel de Estado</h3>
                  <p>
                    Paneles en tiempo real con lo que importa: puertas abiertas, luces encendidas,
                    equipos activos, alertas críticas y eventos fuera de horario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUCIONES CON AUTOMATIZACIÓN TÉCNICA / PROCESOS */}
        <section id="procesos" className="section-compact">
          <div className="container">
            <div className="section-card solution-card">
              <div className="section-header">
                <h2>Soluciones con Automatización para Procesos y Equipos</h2>
                <p>
                  Creamos sistemas internos, scripts y paneles que hacen en segundos lo que hoy
                  tu equipo tarda horas en hacer a mano.
                </p>
              </div>
              <div className="solutions-grid">
                <div className="solution-item">
                  <h3>Optimización de Procesos Técnicos</h3>
                  <p>
                    Cómputo automático de materiales, generación de reportes técnicos, flujos de
                    aprobación y consolidación de datos de obra o producción.
                  </p>
                </div>
                <div className="solution-item">
                  <h3>Automatización Operativa</h3>
                  <p>
                    Scripts y herramientas internas que cargan datos, generan informes, envían
                    documentos y actualizan planillas sin intervención humana.
                  </p>
                </div>
                <div className="solution-item">
                  <h3>Dashboards y Alertas Inteligentes</h3>
                  <p>
                    Paneles web para ver lo importante en tiempo real, con alertas por WhatsApp
                    o email cuando algo se sale de lo normal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTS & AUTOMATIZACIONES DIGITALES */}
        <section id="bots" className="section-compact">
          <div className="container">
            <div className="section-card solution-card">
              <div className="section-header">
                <h2>Bots, IA y Automatizaciones Digitales</h2>
                <p>
                  No solo automatizamos dispositivos físicos, también automatizamos el trabajo
                  digital de tu equipo: ventas, soporte, reportes y comunicación interna.
                </p>
              </div>
              <div className="solutions-grid">
                <div className="solution-item">
                  <h3>Bots de WhatsApp y Atención 24/7</h3>
                  <p>
                    Bots para responder preguntas frecuentes, tomar pedidos, agendar turnos y
                    calificar leads mientras tu equipo duerme.
                  </p>
                </div>
                <div className="solution-item">
                  <h3>Flujos y Tareas Repetitivas</h3>
                  <p>
                    Automatización de envíos de mail, recordatorios, reportes periódicos y
                    sincronización de datos entre sistemas.
                  </p>
                </div>
                <div className="solution-item">
                  <h3>IA Aplicada a Cámaras y Datos</h3>
                  <p>
                    Detección de personas, movimientos o eventos específicos en cámaras, además
                    de análisis de datos para anticipar problemas y mejorar decisiones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POR QUÉ NEUROMIND33 VS HACER TODO A MANO / MUCHOS PROVEEDORES */}
        <section id="vs" className="section-compact">
          <div className="container">
            <div className="section-header">
              <h2>Por Qué Hacerlo con NeuroMind33 y no con 5 Proveedores Distintos</h2>
              <p>Una sola empresa, un solo panel, todo integrado y pensado para escalar.</p>
            </div>
            <table className="vs-table">
              <thead>
                <tr>
                  <th />
                  <th>NeuroMind33</th>
                  <th>Muchos Proveedores</th>
                  <th>Hacer Todo a Mano</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Diseño de solución</td>
                  <td className="good">Arquitectura completa física + digital + IA</td>
                  <td className="bad">Cada uno mira solo su parte</td>
                  <td className="bad">Sin diseño, solo parches</td>
                </tr>
                <tr>
                  <td>Integración</td>
                  <td className="good">Todo conectado en un mismo ecosistema</td>
                  <td className="bad">Sistemas que no se hablan entre sí</td>
                  <td className="bad">Nada se integra, todo es manual</td>
                </tr>
                <tr>
                  <td>Control y paneles</td>
                  <td className="good">Un solo panel para monitorear todo</td>
                  <td className="bad">Cada proveedor tiene su panel</td>
                  <td className="bad">Sin datos, sin métricas</td>
                </tr>
                <tr>
                  <td>Escalabilidad</td>
                  <td className="good">Pensado para crecer sin rehacer todo</td>
                  <td className="bad">Cambiar algo rompe otra cosa</td>
                  <td className="bad">Imposible escalar sin colapsar</td>
                </tr>
                <tr>
                  <td>Soporte</td>
                  <td className="good">Un solo punto de contacto</td>
                  <td className="bad">Cada problema es “culpa del otro”</td>
                  <td className="bad">Vos sos tu propio soporte</td>
                </tr>
                <tr>
                  <td>Automatización real</td>
                  <td className="good">Hardware + software + IA trabajando juntos</td>
                  <td className="bad">Parches y soluciones aisladas</td>
                  <td className="bad">Todo depende de personas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* PLANES */}
        <section id="planes">
          <div className="container">
            <div className="section-header">
              <h2>Elegí el Nivel de Automatización que Querés Lograr</h2>
              <p>
                Cada proyecto se cotiza a medida, pero estas estructuras te ayudan a entender
                hasta dónde podemos llegar.
              </p>
            </div>
            <div className="plans-grid">
              {/* Plan 1 - Hogar Inteligente */}
              <div className="plan-card">
                <div className="plan-header">
                  <h3>Pack Hogar Inteligente</h3>
                  <p>Ideal para empezar con domótica sin complicarse</p>
                </div>
                <div className="plan-body">
                  <ul className="plan-features">
                    <li>
                      <i className="fas fa-check" /> Diseño de sistema de luces y clima
                      inteligente para tu hogar
                    </li>
                    <li>
                      <i className="fas fa-check" /> Control desde app / panel web (encendido,
                      apagado, escenas básicas)
                    </li>
                    <li>
                      <i className="fas fa-check" /> Integración con sensores de movimiento y
                      apertura
                    </li>
                    <li>
                      <i className="fas fa-check" /> Configuración de escenas y horarios
                      automáticos
                    </li>
                    <li>
                      <i className="fas fa-check" /> Proveedores certificados para la
                      instalación física
                    </li>
                    <li>
                      <i className="fas fa-check" /> Soporte post-instalación + ajustes
                      iniciales
                    </li>
                  </ul>
                  <a href="#contacto" className="cta-button plan-btn">
                    Quiero Automatizar Mi Casa
                  </a>
                  <div className="plan-credit-note">
                    <i className="fas fa-info-circle" /> Proyecto a medid

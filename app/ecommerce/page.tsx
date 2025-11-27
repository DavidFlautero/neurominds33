'use client';

import { useEffect } from 'react';
import '../globals.css';
import './ecommerce.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function EcommercePage() {
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
      .querySelectorAll<HTMLElement>('.plan-card, .testimonial-card, .guarantee-item')
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

      {/* MAIN con fondo global de estrellas */}
      <main className="ecommerce-page">
        {/* HERO */}
        <section className="hero">
          {/* overlay transparente (se controla en CSS) */}
          <div className="hero-overlay" />
          <div className="container hero-inner">
            <div className="hero-tag">
              <span>NEUROMIND33 · SISTEMA DE E-COMMERCE AUTOMÁTICO</span>
            </div>

            <h1 className="hero-title">
              Dejá de Perder Ventas y Empezá a Vender Sin Límites
            </h1>

            <p className="hero-subtitle">
              Transformamos tu negocio con un sistema automático que genera ingresos 24/7,
              adaptado 100% a Argentina. Recuperá tu tiempo mientras tu tienda vende sola.
            </p>

            <div className="hero-badges">
              <div className="payment-badge">
                <i className="fas fa-credit-card" /> Pagá en <strong>3 cuotas sin interés</strong>
              </div>
              <div className="local-badge">
                <i className="fas fa-map-marker-alt" /> Adaptado 100% a Argentina
                (Mercado Pago + Envíos Locales)
              </div>
            </div>

            <div className="hero-buttons">
              <a href="#planes" className="cta-button btn-primary">
                Quiero Mi Sistema Automático
              </a>
              <a href="#problema" className="cta-button btn-secondary">
                Ver Cómo Funciona
              </a>
            </div>
          </div>
        </section>

        {/* DISEÑO EXCLUSIVO */}
        <section id="diseno" className="section-compact">
          <div className="container">
            <div className="section-card">
              <div className="section-header">
                <h2>Diseños 100% Exclusivos y Únicos para Tu Marca</h2>
                <p>
                  No usamos plantillas genéricas. Cada proyecto es creado desde cero, con
                  experiencia optimizada para móviles y navegabilidad intuitiva.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEMA */}
        <section id="problema" className="section-compact">
          <div className="container">
            <div className="section-card">
              <div className="section-header">
                <h2>¿Te Sentís Identificada con Esto?</h2>
                <p>
                  El caos de WhatsApp, Instagram como rehén, ventas limitadas... No es tu culpa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* POR QUÉ NOSOTROS vs COMPETENCIA */}
        <section id="vs" className="section-compact">
          <div className="container">
            <div className="section-header">
              <h2>Por Qué Elegirnos vs Tiendanube, Mercado Shops o Plantillas Baratas</h2>
              <p>La verdad que nadie te cuenta hasta que ya pagaste.</p>
            </div>
            <table className="vs-table">
              <thead>
                <tr>
                  <th />
                  <th>NeuroMind33</th>
                  <th>Tiendanube / Mercado Shops</th>
                  <th>Plantilla Barata</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Diseño exclusivo</td>
                  <td className="good">100% a medida, sin plantillas</td>
                  <td className="bad">Plantillas genéricas (todas iguales)</td>
                  <td className="bad">Plantilla básica, sin personalización</td>
                </tr>
                <tr>
                  <td>Posicionamiento en Google</td>
                  <td className="good">
                    Inscripción Google Console + Pixel + Optimización inicial
                  </td>
                  <td className="bad">Lento y limitado, extras pagos</td>
                  <td className="bad">Imposible rankear sin pagar más</td>
                </tr>
                <tr>
                  <td>Costos a largo plazo</td>
                  <td className="good">
                    Pago único, tuyo para siempre + hosting/SSL gratis 1 año
                  </td>
                  <td className="bad">Comisión + mensualidad eterna</td>
                  <td className="bad">Rehacer cada 2 años, costos ocultos</td>
                </tr>
                <tr>
                  <td>Escalabilidad</td>
                  <td className="good">Sin límites de tráfico/productos, crece con vos</td>
                  <td className="bad">Te obligan a subir de plan</td>
                  <td className="bad">Se cae con 100 visitas</td>
                </tr>
                <tr>
                  <td>Integraciones locales</td>
                  <td className="good">
                    Google Maps + QR destino + Mercado Pago/OCA nativos
                  </td>
                  <td className="bad">Extras pagos y básicos</td>
                  <td className="bad">No incluidas, hacelo vos</td>
                </tr>
                <tr>
                  <td>Chatbot IA 24/7</td>
                  <td className="good">
                    Incluido en Servicio Integral (WhatsApp + IG)
                  </td>
                  <td className="bad">Extra pago (y básico)</td>
                  <td className="bad">No existe</td>
                </tr>
                <tr>
                  <td>Garantía</td>
                  <td className="good">2 meses completos + cambios ilimitados</td>
                  <td className="bad">Soporte limitado, extras</td>
                  <td className="bad">Ninguna, arreglalo vos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* PLANES */}
        <section id="planes">
          <div className="container">
            <div className="section-header">
              <h2>Elegí el Nivel de Evolución para tu Negocio</h2>
              <p>Planes con propiedad total, sin comisiones y adaptados a Argentina.</p>
            </div>
            <div className="plans-grid">
              {/* Plan 1 */}
              <div className="plan-card">
                <div className="plan-header">
                  <h3>E-commerce Profesional</h3>
                  <p>Ideal para dar el salto definitivo</p>
                </div>
                <div className="plan-body">
                  <ul className="plan-features">
                    <li>
                      <i className="fas fa-check" /> Diseño web único adaptado a tu identidad
                    </li>
                    <li>
                      <i className="fas fa-check" /> Catálogo, checkout y medios de pago
                      (Mercado Pago incluido)
                    </li>
                    <li>
                      <i className="fas fa-check" /> Secciones optimizadas para conversión +
                      responsive móvil
                    </li>
                    <li>
                      <i className="fas fa-check" /> Panel de control intuitivo +
                      notificaciones email
                    </li>
                    <li>
                      <i className="fas fa-check" /> Soporte técnico básico + hosting/SSL
                      gratis 1 año
                    </li>
                    <li>
                      <i className="fas fa-check" /> Configuración Google Analytics + Meta
                      Pixel
                    </li>
                    <li>
                      <i className="fas fa-robot" style={{ color: 'var(--gray)' }} /> Chatbot
                      IA 24/7 <span style={{ color: 'var(--gray)' }}>(costo adicional)</span>
                    </li>
                  </ul>
                  <a href="#contacto" className="cta-button plan-btn">
                    Quiero mi Tienda Web a Medida
                  </a>
                  <div className="plan-credit-note">
                    <i className="fas fa-credit-card" /> 3 cuotas sin interés
                  </div>
                </div>
              </div>

              {/* Plan 2 */}
              <div className="plan-card popular">
                <div className="plan-badge">MÁS ELEGIDO</div>
                <div className="plan-header">
                  <h3>E-commerce + App Mobile</h3>
                  <p>Llevá tu marca al bolsillo de tus clientes</p>
                </div>
                <div className="plan-body">
                  <ul className="plan-features">
                    <li>
                      <i className="fas fa-check" /> Todo lo del E-commerce Profesional
                    </li>
                    <li>
                      <i className="fas fa-check" /> App móvil personalizada +
                      notificaciones push
                    </li>
                    <li>
                      <i className="fas fa-check" /> Experiencia fluida web/app +
                      integración WhatsApp
                    </li>
                    <li>
                      <i className="fas fa-check" /> Soporte técnico prioritario + mapa de
                      ubicación Google Maps
                    </li>
                    <li>
                      <i className="fas fa-check" /> Inscripción Google Console + QR destino 3
                    </li>
                    <li>
                      <i className="fas fa-check" /> Configuración remarketing + base de
                      clientes email
                    </li>
                    <li>
                      <i className="fas fa-robot" style={{ color: 'var(--gray)' }} /> Chatbot
                      IA 24/7 <span style={{ color: 'var(--gray)' }}>(costo adicional)</span>
                    </li>
                  </ul>
                  <a href="#contacto" className="cta-button plan-btn">
                    Quiero Tienda + App para mi Negocio
                  </a>
                  <div className="plan-credit-note">
                    <i className="fas fa-credit-card" /> 3 cuotas sin interés
                  </div>
                </div>
              </div>

              {/* Plan 3 */}
              <div className="plan-card fullservice">
                <div className="plan-header fullservice-header">
                  <h3>Servicio Integral</h3>
                  <p>Nos encargamos de todo por vos</p>
                </div>
                <div className="plan-body">
                  <ul className="plan-features">
                    <li>
                      <i className="fas fa-check" /> Todo lo del E-commerce + App
                    </li>
                    <li>
                      <i className="fas fa-check" /> Gestión completa de tu tienda online
                    </li>
                    <li>
                      <i className="fas fa-check" /> Estrategias de marketing digital +
                      community management
                    </li>
                    <li>
                      <i className="fas fa-check" /> Gestión de pedidos y logística
                    </li>
                    <li>
                      <i className="fas fa-check" /> Reportes mensuales de resultados + stats
                      real-time
                    </li>
                    <li>
                      <i className="fas fa-check" /> Ingreso a Google Maps + QR destino 3 +
                      inscripción Google Console + Pixel
                    </li>
                    <li>
                      <i className="fas fa-robot" />{' '}
                      <strong>
                        Chatbot IA 24/7 con WhatsApp + Instagram INCLUIDO
                      </strong>{' '}
                      <span className="ai-badge">+38% ventas promedio</span>
                    </li>
                    <li>
                      <i className="fas fa-check" /> Propiedad 100% tuya + hosting/SSL gratis
                      1 año + cambios ilimitados
                    </li>
                  </ul>
                  <a href="#contacto" className="cta-button plan-btn fullservice-btn">
                    Quiero el Servicio Integral
                  </a>
                  <div className="plan-credit-note">
                    <i className="fas fa-credit-card" /> 3 cuotas sin interés
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TECNOLOGÍAS */}
        <section className="tech-section section-compact">
          <div className="container">
            <div className="section-card">
              <p className="tech-text">
                Trabajamos con las mejores tecnologías del mercado para entregarte un sistema
                sólido, rápido y 100% adaptado a tu negocio.
              </p>
              <div className="tech-logos">
                {/* tus logos aquí */}
              </div>
              <p className="tech-footnote">
                Usamos la combinación perfecta según tu proyecto. Vos no tenés que entender nada
                técnico.
              </p>
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section id="testimonios" className="section-compact">
          <div className="container">
            <div className="section-card">
              <div className="section-header">
                <h2>Lo que Dicen Nuestros Clientes</h2>
                <p>5.0 en Google basado en 167 opiniones – Más de 450 proyectos realizados.</p>
              </div>
              <div className="testimonials-grid">
                {/* testimonial-card... */}
              </div>
            </div>
          </div>
        </section>

        {/* GARANTÍAS */}
        <section className="section-compact">
          <div className="container">
            <div className="section-card">
              <div className="section-header">
                <h2>Invertí con Confianza Total</h2>
                <p>
                  Garantía de 2 meses en todos los planes – No entregamos hasta que apruebes cada
                  detalle.
                </p>
              </div>
              <div className="guarantee-grid">
                {/* guarantee-item... */}
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL / CONTACTO */}
        <section id="contacto" className="cta-section section-compact">
          <div className="container">
            <div className="cta-section-inner">
              <h2>¿Lista para Recuperar tu Tiempo y Hacer Crecer tu Negocio?</h2>
              <p>
                No esperes más para dar el salto que tu negocio necesita. Agenda una consulta
                gratuita y descubrí cómo podemos crear juntos el sistema perfecto para tu marca.
              </p>
              <div className="scarcity">¡Quedan solo 2 cupos este mes!</div>
              <a href="#" className="cta-button-large">
                Agendar Consulta Gratuita Ahora (15 min)
              </a>
              <a href="https://wa.me/541112345678" className="whatsapp-cta">
                <i className="fab fa-whatsapp" /> Chatear por WhatsApp Ahora
              </a>
              <div className="payment-badge cta-badge">
                <i className="fas fa-credit-card" /> Pagá en{' '}
                <strong>3 cuotas sin interés</strong> con tarjeta de crédito
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

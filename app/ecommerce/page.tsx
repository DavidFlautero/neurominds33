'use client';

import { useEffect } from 'react';
import './ecommerce.css';

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

    anchors.forEach(a => a.addEventListener('click', onClick));

    // Animaciones de scroll
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    });

    document
      .querySelectorAll<HTMLElement>('.plan-card, .testimonial-card, .guarantee-item')
      .forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });

    return () => {
      anchors.forEach(a => a.removeEventListener('click', onClick));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* ⚠️ IMPORTANTE: 
          NO ponemos <header> ni <footer> acá,
          porque los va a poner tu layout global.
      */}

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <h1>Dejá de Perder Ventas y Empezá a Vender Sin Límites</h1>
          <p>
            Transformamos tu negocio con un sistema automático que genera ingresos 24/7, adaptado 100% a
            Argentina. Recuperá tu tiempo mientras tu tienda vende sola.
          </p>
          <div className="payment-badge">
            <i className="fas fa-credit-card"></i> Pagá en <strong>3 cuotas sin interés</strong>
          </div>
          <div className="local-badge">
            <i className="fas fa-map-marker-alt"></i> Adaptado 100% a Argentina (Mercado Pago + Envíos Locales)
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
      <section id="diseno" className="design-section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>Diseños 100% Exclusivos y Únicos para Tu Marca</h2>
            <p>
              No usamos plantillas genéricas. Cada proyecto es creado desde cero, con experiencia optimizada para
              móviles y navegabilidad intuitiva.
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="problema" className="problem-section" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="section-header">
            <h2>¿Te Sentís Identificada con Esto?</h2>
            <p>El caos de WhatsApp, Instagram como rehén, ventas limitadas... No es tu culpa.</p>
          </div>
        </div>
      </section>

      {/* POR QUÉ NOSOTROS vs COMPETENCIA */}
      <section id="vs" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2>Por Qué Elegirnos vs Tiendanube, Mercado Shops o Plantillas Baratas</h2>
            <p>La verdad que nadie te cuenta hasta que ya pagaste.</p>
          </div>
          {/* tabla igual que tu HTML, adaptada a JSX */}
          <table className="vs-table">
            <thead>
              <tr>
                <th></th>
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
              {/* ... resto de filas igual que tu HTML ... */}
            </tbody>
          </table>
        </div>
      </section>

      {/* PLANES */}
      {/* Acá copias las 3 plan-card igual que tu HTML, solo cambiando class → className */}

      {/* SECCIÓN TECNOLOGÍAS, TESTIMONIOS, GARANTÍAS, CTA FINAL */}
      {/* Todo igual que tu HTML, sin header/footer, class → className */}
    </>
  );
}

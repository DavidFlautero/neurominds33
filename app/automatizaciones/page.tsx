'use client';

import { useEffect } from 'react';
import '../globals.css';
import './automatizaciones.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ====== WHATSAPP HELPERS ====== */
const WHATSAPP_NUMBER = '541168322437';

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
    const anchors = document.querySelectorAll('a[href^="#"]');
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
      .querySelectorAll('.plan-card, .solution-card, .guarantee-item')
      .forEach((el) => {
        const element = el as HTMLElement;
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
      });

    return () => {
      anchors.forEach((a) => a.removeEventListener('click', onClick));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="automation-page">
        {/* HERO */}
        <section className="hero">
          {/* 🎥 VIDEO DE FONDO */}
          <video
            className="hero-video"
            src="./videos/automatizaciones/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          {/* capa oscura encima del video */}
          <div className="hero-overlay" />

          {/* contenido encima de todo */}
          <div className="container hero-inner">
            <div className="hero-tag">
              <span>NEUROMIND33 · SOLUCIONES CON AUTOMATIZACIÓN</span>
            </div>

            <h1 className="hero-title">Hacemos que Tu Casa y Tu Empresa Trabajen Solas</h1>

            <p className="hero-subtitle">
              Integramos domótica, software e inteligencia artificial para automatizar tareas,
              procesos y sistemas. Desde prender luces y controlar accesos hasta bots que
              eliminan trabajo manual en tu negocio.
            </p>

            <div className="hero-badges">
              <div className="payment-badge">
                <i className="fas fa-bolt" /> Proyectos <strong>diseñados a medida</strong>
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

        {/* …el resto de secciones tal como lo tenías */}
      </main>

      <Footer />
    </>
  );
}

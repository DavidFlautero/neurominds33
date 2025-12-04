"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMobile = () => setOpen(false);

  return (
    <div className="nav" role="navigation">
      <div className="wrap row">
        {/* BRAND */}
        <Link href="/" className="brand" aria-label="NeuroMind33">
          <div className="brand-logo">
            <Image
              src="/brand/neuro-head-light.png"
              alt="Logo NeuroMind33"
              width={32}
              height={32}
              className="brand-logo-img"
            />
          </div>
          <span className="brand-text">NEUROMIND33</span>
        </Link>

        {/* Desktop */}
        <nav className="menu desktop" aria-label="Menú principal">
          {/* Inicio */}
          <Link href="/">Inicio</Link>

          {/* SOLUCIONES (desplegable) */}
          <div className="menu-item has-dropdown">
            <button
              type="button"
              className="menu-trigger"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Soluciones
              <span className="chevron" aria-hidden="true">▾</span>
            </button>
            <div className="dropdown">
              <Link href="/#software-ia">Software &amp; IA</Link>
              <Link href="/ecommerce">Web &amp; E-commerce</Link>
              <Link href="/automatizaciones">Automatización &amp; Domótica</Link>
            </div>
          </div>

          {/* SECTORES (desplegable) */}
          <div className="menu-item has-dropdown">
            <button
              type="button"
              className="menu-trigger"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Sectores
              <span className="chevron" aria-hidden="true">▾</span>
            </button>
            <div className="dropdown">
              <Link href="/#empresas">Empresas</Link>
              <Link href="/#pymes">PYMES</Link>
              <Link href="/#comercios">Comercios</Link>
              <Link href="/#restaurantes">Restaurantes</Link>
              <Link href="/#gimnasios">Gimnasios</Link>
              <Link href="/#alquileres">Alquileres temporarios</Link>
            </div>
          </div>

          {/* NOSOTROS (desplegable) */}
          <div className="menu-item has-dropdown">
            <button
              type="button"
              className="menu-trigger"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Nosotros
              <span className="chevron" aria-hidden="true">▾</span>
            </button>
            <div className="dropdown">
              <Link href="/#vision">Visión</Link>
              <Link href="/#equipo">Equipo</Link>
              <Link href="/#socios">Socios / Partners</Link>
            </div>
          </div>

          {/* Área cliente */}
          <Link href="/login" className="btn">
            Área cliente
          </Link>

          {/* WhatsApp / contacto */}
          <a href="#contacto" className="btn primary" id="openModalTop">
            Hablar ahora
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="burger"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Drawer mobile */}
      <div
        className={`drawer ${open ? "open" : ""}`}
        onClick={closeMobile}
        aria-hidden={!open}
      >
        <nav
          className="drawer-inner"
          aria-label="Menú móvil"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Inicio */}
          <Link href="/" onClick={closeMobile}>
            Inicio
          </Link>

          {/* Bloque SOLUCIONES */}
          <p className="drawer-section-label">Soluciones</p>
          <Link href="/#software-ia" onClick={closeMobile}>
            Software &amp; IA
          </Link>
          <Link href="/ecommerce" onClick={closeMobile}>
            Web &amp; E-commerce
          </Link>
          <Link href="/automatizaciones" onClick={closeMobile}>
            Automatización &amp; Domótica
          </Link>

          {/* Bloque SECTORES */}
          <p className="drawer-section-label">Sectores</p>
          <Link href="/#empresas" onClick={closeMobile}>
            Empresas
          </Link>
          <Link href="/#pymes" onClick={closeMobile}>
            PYMES
          </Link>
          <Link href="/#comercios" onClick={closeMobile}>
            Comercios
          </Link>
          <Link href="/#restaurantes" onClick={closeMobile}>
            Restaurantes
          </Link>
          <Link href="/#gimnasios" onClick={closeMobile}>
            Gimnasios
          </Link>
          <Link href="/#alquileres" onClick={closeMobile}>
            Alquileres temporarios
          </Link>

          {/* Bloque NOSOTROS */}
          <p className="drawer-section-label">Nosotros</p>
          <Link href="/#vision" onClick={closeMobile}>
            Visión
          </Link>
          <Link href="/#equipo" onClick={closeMobile}>
            Equipo
          </Link>
          <Link href="/#socios" onClick={closeMobile}>
            Socios / Partners
          </Link>

          {/* Área cliente */}
          <Link href="/login" className="btn" onClick={closeMobile}>
            Área cliente
          </Link>

          {/* Contacto */}
          <a
            href="#contacto"
            className="btn primary"
            id="openModalTop"
            onClick={closeMobile}
          >
            Hablar ahora
          </a>
        </nav>
      </div>
    </div>
  );
}

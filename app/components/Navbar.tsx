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

  return (
    <div className="nav" role="navigation">
      <div className="wrap row">
        {/* BRAND NUEVA */}
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
        <nav className="menu desktop" aria-label="Principal">
          <a href="#vision">Visión</a>
          <a href="#servicios">Servicios</a>
          <a href="#empresas">Empresas</a>
          <a href="#pymes">PYMES</a>
          <a href="#socios">Socios</a>
          <Link href="/login" className="btn">
            Login / Área cliente
          </Link>
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
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <nav
          className="drawer-inner"
          aria-label="Menú móvil"
          onClick={(e) => e.stopPropagation()}
        >
          <a href="#vision">Visión</a>
          <a href="#servicios">Servicios</a>
          <a href="#empresas">Empresas</a>
          <a href="#pymes">PYMES</a>
          <a href="#socios">Socios</a>
          <Link href="/login" className="btn">
            Login / Área cliente
          </Link>
          <a href="#contacto" className="btn primary" id="openModalTop">
            Hablar ahora
          </a>
        </nav>
      </div>
    </div>
  );
}

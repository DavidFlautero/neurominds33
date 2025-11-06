"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar(){
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="nav" role="navigation">
      <div className="wrap row">
        <div className="brand"><span className="dot" aria-hidden="true"></span> NeuroMind33</div>

        {/* Desktop */}
        <nav className="menu desktop" aria-label="Principal">
          <a href="#vision">Visión</a>
          <a href="#servicios">Servicios</a>
          <a href="#empresas">Empresas</a>
          <a href="#pymes">PYMES</a>
          <a href="#socios">Socios</a>
          <Link href="/login" className="btn">Login / Área cliente</Link>
          <a href="#contacto" className="btn primary" id="openModalTop">Hablar ahora</a>
        </nav>

        {/* Mobile toggle */}
        <button className="burger" aria-label="Abrir menú" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
          <span/><span/><span/>
        </button>
      </div>

      {/* Drawer mobile */}
      <div className={`drawer ${open ? "open": ""}`} onClick={()=>setOpen(false)} aria-hidden={!open}>
        <nav className="drawer-inner" aria-label="Menú móvil" onClick={(e)=>e.stopPropagation()}>
          <a href="#vision">Visión</a>
          <a href="#servicios">Servicios</a>
          <a href="#empresas">Empresas</a>
          <a href="#pymes">PYMES</a>
          <a href="#socios">Socios</a>
          <Link href="/login" className="btn">Login / Área cliente</Link>
          <a href="#contacto" className="btn primary" id="openModalTop">Hablar ahora</a>
        </nav>
      </div>
    </div>
  );
}

"use client";

import { Cpu, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border mt-auto">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          
          {/* Brand Column (2 Spans en todas las pantallas) */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <a href="/" className="inline-flex items-center gap-2">
              <Cpu className="w-7 h-7 text-primary" />
              <span className="text-2xl font-bold tracking-tight text-primary">
                Nexus<span className="text-ink">PC</span>
              </span>
            </a>

            <p className="text-sm text-ink-secondary leading-relaxed max-w-sm">
              Precision Engineered. Elevando el estándar del hardware en Latinoamérica con garantía oficial, asesoramiento profesional y ensamblado de alta precisión.
            </p>

            {/* Social Redes */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-surface-alt border border-border/60 flex items-center justify-center text-ink-secondary hover:text-primary hover:border-primary/40 hover:bg-primary-tint/50 transition-all"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="X / Twitter"
                className="w-9 h-9 rounded-lg bg-surface-alt border border-border/60 flex items-center justify-center text-ink-secondary hover:text-primary hover:border-primary/40 hover:bg-primary-tint/50 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-surface-alt border border-border/60 flex items-center justify-center text-ink-secondary hover:text-primary hover:border-primary/40 hover:bg-primary-tint/50 transition-all"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Web Global"
                className="w-9 h-9 rounded-lg bg-surface-alt border border-border/60 flex items-center justify-center text-ink-secondary hover:text-primary hover:border-primary/40 hover:bg-primary-tint/50 transition-all"
              >
                <Globe className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Columna 1: Compañía */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-ink uppercase">Compañía</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Sobre Nosotros</a>
              </li>
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Carreras</a>
              </li>
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Blog Tech & News</a>
              </li>
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Nuestras Tiendas</a>
              </li>
            </ul>
          </div>

          {/* Columna 2: Soporte */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-ink uppercase">Soporte</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Centro de Ayuda</a>
              </li>
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Garantías y RMA</a>
              </li>
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Seguimiento de Envío</a>
              </li>
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Preguntas Frecuentes</a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legales */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-ink uppercase">Legales</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Términos de Servicio</a>
              </li>
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Política de Privacidad</a>
              </li>
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Política de Cookies</a>
              </li>
              <li>
                <a href="#" className="text-ink-secondary hover:text-primary transition-colors">Boton de Arrepentimiento</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar (Copyright) */}
        <div className="mt-12 pt-8 border-t border-border/60 flex items-center justify-center text-center text-xs text-ink-secondary">
          <p>© 2026 NexusPC PC Components. Precision Engineered. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

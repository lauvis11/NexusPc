"use client";

import { useState } from "react";
import { Search, ShoppingCart, User, Cpu, Menu, X, LogOut, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/context/auth-context";

const NAV_LINKS = [
  { label: "Productos", href: "/productos" },
  { label: "Notebooks", href: "/productos" },
  { label: "Procesadores", href: "/productos" },
  { label: "Tarjetas Gráficas", href: "/productos" },
  { label: "Periféricos", href: "/productos" },
  { label: "Ayuda", href: "#" },
];

export function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  return (
    <>
      <header className="fixed top-0 w-full z-50 shadow-xs border-b border-border/50">
        {/* ── TOP BAR ──────────────────────────────────────────── */}
        <div className="h-16 flex items-center bg-surface border-b border-border/30">
          <nav className="relative flex items-center justify-between px-4 sm:px-6 w-full max-w-7xl mx-auto gap-4 sm:gap-6">

            {/* Left: Hamburger + Logo (Ancho simétrico en desktop) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 sm:w-48">
              <button
                className="sm:hidden p-2 text-ink-secondary hover:text-primary transition-colors rounded-xl hover:bg-primary-tint/60 cursor-pointer shrink-0"
                aria-label="Abrir menú"
                onClick={() => setMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              <a href="/" className="flex items-center gap-2 shrink-0 group">
                <Cpu className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold tracking-tight text-primary">
                  Nexus<span className="text-ink">PC</span>
                </span>
              </a>
            </div>

            {/* Search Bar — Centrada siempre matemáticamente */}
            <div className="hidden sm:flex flex-1 max-w-xl mx-auto items-center bg-primary-tint/50 px-4 py-1.5 rounded-lg border border-border/60 focus-within:border-primary focus-within:bg-surface transition-all">
              <Search className="w-4 h-4 text-ink-secondary shrink-0" />
              <input
                type="text"
                placeholder="Buscar componentes, periféricos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm w-full ml-2.5 text-ink placeholder:text-ink-secondary/70"
              />
            </div>

            {/* Right icons (Ancho simétrico en desktop alineado a la derecha) */}
            <div className="flex items-center justify-end gap-1 sm:gap-3 shrink-0 sm:w-48">
              {/* Search icon — mobile only */}
              <button
                className="sm:hidden p-2 text-ink-secondary hover:text-primary transition-colors rounded-xl hover:bg-primary-tint/60 cursor-pointer"
                aria-label="Buscar"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Cart */}
              <button
                className="p-2 sm:p-2.5 text-ink-secondary hover:text-primary transition-colors relative rounded-xl hover:bg-primary-tint/60 cursor-pointer"
                aria-label="Carrito de Compras"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-surface" />
                )}
              </button>

              {/* User Icon & Dropdown Condicional */}
              {isLoading ? (
                <div className="p-2 sm:p-2.5 text-primary shrink-0 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen((v) => !v)}
                    className="p-2 sm:p-2.5 text-ink-secondary hover:text-primary transition-colors rounded-xl hover:bg-primary-tint/60 cursor-pointer flex items-center gap-1.5"
                    aria-label="Cuenta de Usuario"
                  >
                    <User className="w-6 h-6 text-primary" />
                    <span className="hidden lg:inline text-xs font-bold text-ink max-w-[90px] truncate">
                      {user.nombre}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-ink-secondary hidden sm:inline" />
                  </button>

                  {/* Dropdown Menu Flotante (Con Borde Azul Principal Solido) */}
                  {userDropdownOpen && (
                    <>
                      {/* Fondo transparente para cerrar al hacer clic afuera */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserDropdownOpen(false)}
                      />

                      <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl border-2 border-primary shadow-xl z-50 p-2 animate-fade-in space-y-1.5">
                        {/* Opciones */}
                        <a
                          href="/perfil"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold text-ink hover:bg-primary-tint/50 hover:text-primary transition-colors"
                        >
                          <User className="w-5 h-5 text-primary" />
                          <span>Mi Cuenta</span>
                        </a>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-5 h-5 text-red-600" />
                          <span>Cerrar sesión</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <a
                  href="/login"
                  className="p-2 sm:p-2.5 text-ink-secondary hover:text-primary transition-colors rounded-xl hover:bg-primary-tint/60 cursor-pointer flex items-center gap-1.5"
                  aria-label="Iniciar Sesión"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden lg:inline text-xs font-bold text-ink">Ingresar</span>
                </a>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="sm:hidden bg-surface border-b border-border/30 px-4 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-ink-secondary shrink-0" />
            <input
              type="text"
              placeholder="Buscar componentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm w-full text-ink placeholder:text-ink-secondary/70"
            />
          </div>
        )}

        {/* ── BOTTOM NAV BAR (desktop only) ─────────────────────── */}
        <div className="hidden sm:flex h-13 items-center bg-primary text-surface">
          <nav className="flex gap-8 lg:gap-11 px-6 w-full max-w-7xl mx-auto justify-center text-sm lg:text-base font-semibold">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-primary-tint hover:text-surface transition-colors py-1 border-b-2 border-transparent hover:border-surface whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── MOBILE DRAWER ───────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 z-[70] bg-surface shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out sm:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border/30 shrink-0">
          <a href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <Cpu className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold tracking-tight text-primary">
              Nexus<span className="text-ink">PC</span>
            </span>
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-ink-secondary hover:text-primary transition-colors rounded-xl hover:bg-primary-tint/60 cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex flex-col py-4 flex-grow overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3.5 text-sm font-semibold text-ink hover:text-primary hover:bg-primary-tint/50 transition-colors border-b border-border/20 last:border-none"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Drawer footer condicional */}
        <div className="px-4 py-4 border-t border-border/30 shrink-0 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-3 text-primary">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : user ? (
            <>
              <a
                href="/perfil"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-primary-tint/50 text-ink hover:text-primary transition-colors cursor-pointer"
              >
                <User className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold truncate">Mi cuenta ({user.nombre})</span>
              </a>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-500/10 text-red-600 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-sm font-bold">Cerrar sesión</span>
              </button>
            </>
          ) : (
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-primary-tint/50 text-ink-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-semibold">Iniciar Sesión</span>
            </a>
          )}
        </div>
      </aside>
    </>
  );
}

export default Header;

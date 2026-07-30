"use client";

import { useState } from "react";
import { Search, ShoppingCart, User, Cpu } from "lucide-react";

export function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(1);

  return (
    <header className="fixed top-0 w-full z-50 shadow-xs border-b border-border/50">
      {/* Top Level: Logo, Buscador y Acciones (Fondo Blanco) */}
      <div className="h-16 flex items-center bg-surface border-b border-border/30">
        <nav className="flex justify-between items-center px-6 w-full max-w-7xl mx-auto gap-8">
          {/* Left: Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0 group">
            <Cpu className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-primary">
              Nexus<span className="text-ink">PC</span>
            </span>
          </a>

          {/* Center: Search Bar */}
          <div className="flex-grow max-w-2xl flex items-center bg-primary-tint/50 px-4 py-1.5 rounded-lg border border-border/60 focus-within:border-primary focus-within:bg-surface transition-all">
            <Search className="w-4 h-4 text-ink-secondary shrink-0" />
            <input
              type="text"
              placeholder="Buscar componentes, periféricos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm w-full ml-2.5 text-ink placeholder:text-ink-secondary/70"
            />
          </div>

          {/* Right: Iconos de usuario y carrito */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              className="p-2.5 text-ink-secondary hover:text-primary transition-colors relative rounded-xl hover:bg-primary-tint/60"
              aria-label="Carrito de Compras"
            >
              <ShoppingCart className="w-6.5 h-6.5" />
              {cartCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-surface"></span>
              )}
            </button>
            <button
              className="p-2.5 text-ink-secondary hover:text-primary transition-colors rounded-xl hover:bg-primary-tint/60"
              aria-label="Cuenta de Usuario"
            >
              <User className="w-6.5 h-6.5" />
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Level: Links de Navegación de Categorías (Fondo Azul) */}
      <div className="h-13 flex items-center bg-primary text-surface">
        <nav className="flex gap-11 px-6 w-full max-w-7xl mx-auto justify-center text-base font-semibold">
          <a
            href="#"
            className="text-primary-tint hover:text-surface transition-colors py-1 border-b-2 border-transparent hover:border-surface"
          >
            Productos
          </a>
          <a
            href="#"
            className="text-primary-tint hover:text-surface transition-colors py-1 border-b-2 border-transparent hover:border-surface"
          >
            Notebooks
          </a>
          <a
            href="#"
            className="text-primary-tint hover:text-surface transition-colors py-1 border-b-2 border-transparent hover:border-surface"
          >
            Procesadores
          </a>
          <a
            href="#"
            className="text-primary-tint hover:text-surface transition-colors py-1 border-b-2 border-transparent hover:border-surface"
          >
            Tarjetas Gráficas
          </a>
          <a
            href="#"
            className="text-primary-tint hover:text-surface transition-colors py-1 border-b-2 border-transparent hover:border-surface"
          >
            Ayuda
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;

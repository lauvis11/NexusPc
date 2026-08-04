"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "../../../shared/components/layout/Header";
import { Footer } from "../../../shared/components/layout/Footer";
import { ProductosCarrito } from "../../../features/carrito/components/ProductosCarrito";

export default function CarritoPage() {
  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Header Modular */}
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* ── SECCIÓN 1: TÍTULO Y CONTINUAR COMPRANDO ─────────────── */}
        <div className="flex items-center justify-between pb-6 border-b border-border/50 mb-8 gap-4">
          <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
            Mi <span className="text-primary font-black">Carrito</span>
          </h1>

          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-primary hover:underline transition-all group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Continuar comprando</span>
          </Link>
        </div>

        {/* ── GRID PRINCIPAL DEL CARRITO ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── SECCIÓN 2: LISTA DE PRODUCTOS (LG: 8 Cols) ────────── */}
          <div className="lg:col-span-8">
            <ProductosCarrito />
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

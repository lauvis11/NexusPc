"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { ProductosCarrito } from "@/features/carrito/components/ProductosCarrito";
import { ResumenCompra } from "@/features/carrito/components/ResumenCompra";
import { useCarritoStore } from "@/features/carrito/store/store";

export default function CarritoPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCarritoStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Header Modular */}
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* ── SECCIÓN 1: TÍTULO Y CONTINUAR COMPRANDO ─────────────── */}
        <div className="flex items-center justify-between pb-6 border-b border-border/50 mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
              Mi <span className="text-primary font-black">Carrito</span>
            </h1>
          </div>

          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-primary hover:underline transition-all group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Continuar comprando</span>
          </Link>
        </div>

        {/* ── ESTADO DE CARGA / HIDRATACIÓN ───────────────────────── */}
        {!mounted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
            <div className="lg:col-span-8 h-80 bg-surface rounded-2xl border border-border" />
            <div className="lg:col-span-4 h-80 bg-surface rounded-2xl border border-border" />
          </div>
        ) : items.length === 0 ? (
          /* ── ESTADO VACÍO ────────────────────────────────────────── */
          <div className="bg-surface border border-border rounded-2xl p-10 sm:p-16 text-center space-y-5 shadow-2xs max-w-xl mx-auto my-8">
            <div className="w-20 h-20 rounded-full bg-primary-tint flex items-center justify-center text-primary mx-auto shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-ink tracking-tight">
                Tu carrito está vacío
              </h2>
              <p className="text-sm text-ink-secondary max-w-md mx-auto">
                No tienes productos en tu carrito aún. Explora nuestro catálogo y equipate con lo último en hardware y gaming.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-primary text-surface font-extrabold text-sm rounded-xl hover:bg-primary-hover active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Explorar Productos
              </Link>
            </div>
          </div>
        ) : (
          /* ── GRID PRINCIPAL DEL CARRITO CON ITEMS ────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <ProductosCarrito />
            </div>

            <div className="lg:col-span-4">
              <ResumenCompra />
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

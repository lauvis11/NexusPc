"use client";

import Link from "next/link";
import { X, RotateCcw, ShoppingCart, HelpCircle } from "lucide-react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";

export default function PagoErrorPage() {
  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Header Modular con Navbar */}
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      {/* Contenido Principal Limpio */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
        {/* Ícono de Error: Círculo rojo sólido con X blanca */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs">
          <X className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
        </div>

        {/* Títulos */}
        <div className="space-y-3 max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight">
            No Pudimos Procesar tu Pago
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            El pago fue rechazado por la entidad emisora o Mercado Pago. No te preocupes, <strong className="text-ink">no se ha realizado ningún cobro</strong> en tu tarjeta ni cuenta.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="w-full space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link
              href="/checkout"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-primary hover:bg-primary-hover text-surface font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer text-center"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reintentar Pago</span>
            </Link>

            <Link
              href="/carrito"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface hover:bg-surface-alt border border-border text-ink font-bold text-xs sm:text-sm rounded-xl transition-all shadow-2xs text-center cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-ink-secondary" />
              <span>Volver al Carrito</span>
            </Link>
          </div>

          <div>
            <Link
              href="/ayuda"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover hover:underline transition-colors pt-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>¿Necesitás ayuda con tu pago? Contactar Soporte</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

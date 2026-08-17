"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, AlertCircle, X } from "lucide-react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { useCarritoStore } from "@/features/carrito/store/store";
import { useRouter } from "next/navigation";
import { DatosFacturacionOrden } from "@/features/ordenes/components/DatosFacturacionOrden";
import { ResumenCheckout } from "@/features/ordenes/components/ResumenCheckout";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [showModalVolver, setShowModalVolver] = useState(false);
  const { items } = useCarritoStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirigir a /carrito solo después de que se cargue el store si el carrito sigue vacío
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/carrito");
    }
  }, [mounted, items, router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary relative">
      {/* Header Modular con Navbar */}
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Título de la Página */}
        <div className="pb-4 border-b border-border/50">
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Finalizar Compra
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Completá tus datos de entrega y continuá al pago para confirmar tu orden.
          </p>
        </div>

        {/* Layout en 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Datos de Facturación (7 columnas) */}
          <div className="lg:col-span-7 space-y-6">
            <DatosFacturacionOrden />

            {/* Botón Anterior */}
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={() => setShowModalVolver(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface hover:bg-surface-alt font-extrabold text-xs sm:text-sm text-ink hover:text-primary transition-all shadow-2xs hover:border-primary/40 active:scale-98 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            </div>
          </div>

          {/* Columna Derecha: Resumen de Compra Sticky (5 columnas) */}
          <div className="lg:col-span-5">
            <ResumenCheckout />
          </div>
        </div>
      </main>

      {/* ── MODAL DE CONFIRMACIÓN PARA VOLVER AL CARRITO ─────────── */}
      {showModalVolver && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            className="bg-surface border border-border rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setShowModalVolver(false)}
              className="absolute top-4 right-4 text-ink-secondary hover:text-ink p-1 rounded-lg hover:bg-surface-alt transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ícono y Título */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-ink tracking-tight">
                  ¿Estás seguro que quieres volver al carrito?
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  Tus productos se mantendrán guardados, pero deberás revisar tus datos al volver a esta pantalla.
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Opción Secundaria */}
              <button
                type="button"
                onClick={() => router.push("/carrito")}
                className="order-2 sm:order-1 flex-1 py-3 px-5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-ink-secondary hover:text-ink font-bold text-xs sm:text-sm transition-all text-center cursor-pointer whitespace-nowrap"
              >
                Si, quiero volver
              </button>

              {/* Opción Principal / Remarcada */}
              <button
                type="button"
                onClick={() => setShowModalVolver(false)}
                className="order-1 sm:order-2 flex-1 py-3 px-5 rounded-xl bg-primary hover:bg-primary-hover text-surface font-extrabold text-xs sm:text-sm shadow-md transition-all text-center cursor-pointer active:scale-98 whitespace-nowrap"
              >
                No, continuar la compra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
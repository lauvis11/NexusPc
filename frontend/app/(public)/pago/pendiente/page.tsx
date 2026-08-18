"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Clock,
  ShoppingBag,
  FileCheck2,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";

function ContenidoPagoPendiente() {
  const searchParams = useSearchParams();
  const [copiado, setCopiado] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // A los 900ms comienza la transición suave de salida
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 900);

    // A los 1500ms se desmonta la pantalla de intro
    const endTimer = setTimeout(() => {
      setShowIntro(false);
    }, 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, []);

  // Parámetros de Mercado Pago (o valores por defecto al ingresar por URL)
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id") || "MP-PEND8391";
  const externalReference = searchParams.get("external_reference") || "NX-849204";

  const copiarOrden = () => {
    navigator.clipboard.writeText(externalReference);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <>
      {/* ── ANIMACIÓN INICIAL DE INTRODUCCIÓN ─────────────────────── */}
      {showIntro && (
        <div
          className={`fixed inset-0 z-50 bg-surface flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
            isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <div className="flex flex-col items-center space-y-4 animate-in zoom-in-75 duration-500 ease-out">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-lg">
              <Clock className="w-12 h-12 sm:w-14 sm:h-14 stroke-[3]" />
            </div>
            <span className="text-lg sm:text-xl font-black text-ink tracking-tight">
              Procesando Pago...
            </span>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-in fade-in duration-500">
        {/* ── SECCIÓN PRINCIPAL DE PAGO PENDIENTE (SIN BORDES DE CONTENEDOR) ── */}
        <section className="text-center space-y-6">
          {/* Ícono de Estado Pendiente: Círculo ámbar sólido con reloj blanco */}
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
            </div>
          </div>

          {/* Títulos */}
          <div className="space-y-2 max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight">
              Tu Pago está Pendiente de Acreditación
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              <strong className="text-ink">Mercado Pago</strong> está procesando tu transacción. Si abonaste en efectivo (Pago Fácil / Rapipago) o transferencia, la confirmación puede demorar entre 1 a 24 horas hábiles. Te avisaremos por email en cuanto se acredite.
            </p>
          </div>

          {/* Tira Plana de Metadatos de la Transacción (Siempre 3 Columnas en Mobile y Desktop) */}
          <div className="bg-surface-alt/60 rounded-2xl p-3.5 sm:p-7 grid grid-cols-3 gap-2 sm:gap-6 text-center max-w-3xl mx-auto">
            {/* 1. ID de Orden */}
            <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-1.5 min-w-0">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-ink-secondary block leading-tight truncate">
                Nº de Orden
              </span>
              <div className="flex items-center justify-center gap-1 sm:gap-2 max-w-full">
                <span className="text-xs sm:text-base font-black text-ink truncate">{externalReference}</span>
                <button
                  type="button"
                  onClick={copiarOrden}
                  title="Copiar ID de Orden"
                  className="p-0.5 sm:p-1 rounded-md text-ink-secondary hover:text-primary transition-colors cursor-pointer shrink-0"
                >
                  {copiado ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              </div>
            </div>

            {/* 2. ID Transacción MP */}
            <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-1.5 min-w-0">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-ink-secondary block leading-tight truncate">
                Transacción MP
              </span>
              <span className="text-xs sm:text-base font-black text-ink block truncate">{paymentId}</span>
            </div>

            {/* 3. Estado */}
            <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-1.5 min-w-0">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-ink-secondary block leading-tight truncate">
                Estado
              </span>
              <span className="text-xs sm:text-base font-black text-amber-500 block truncate">
                Pendiente
              </span>
            </div>
          </div>
        </section>

        {/* ── NOTA INFORMATIVA SUTIL ─────────────────────────────────── */}
        <section className="max-w-2xl mx-auto">
          <div className="flex items-start gap-3 p-4 sm:p-5 bg-amber-500/10 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm text-left">
              <span className="font-extrabold text-ink block">
                ¿Pagás en efectivo o cupón de pago?
              </span>
              <p className="text-ink-secondary leading-relaxed">
                Recordá acudir a tu sucursal más cercana de Pago Fácil o Rapipago antes de la fecha de vencimiento que figura en el cupón emitido por Mercado Pago.
              </p>
            </div>
          </div>
        </section>

        {/* ── BOTONES DE ACCIÓN (CTAS) ──────────────────────────────── */}
        <section className="flex flex-col items-center gap-4 pt-4 pb-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link
              href="/perfil"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-primary hover:bg-primary-hover text-surface font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer text-center"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Ver Mis Datos y Pedidos</span>
            </Link>

            <Link
              href="/productos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface hover:bg-surface-alt border border-border text-ink font-bold text-xs sm:text-sm rounded-xl transition-all shadow-2xs text-center cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-ink-secondary" />
              <span>Seguir Explorando Productos</span>
            </Link>
          </div>

          <Link
            href="/ayuda"
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover hover:underline transition-colors mt-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>¿Tenés dudas sobre tu acreditación? Contactar Soporte</span>
          </Link>
        </section>
      </main>
    </>
  );
}

export default function PagoPendientePage() {
  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      {/* Header Modular con Navbar */}
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      {/* Contenido envuelto en Suspense por el useSearchParams */}
      <Suspense
        fallback={
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 text-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <ContenidoPagoPendiente />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}

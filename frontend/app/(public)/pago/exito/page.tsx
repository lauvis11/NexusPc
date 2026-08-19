"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Package,
  Truck,
  Home,
  ShoppingBag,
  Copy,
  FileCheck2,
} from "lucide-react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";

function ContenidoPagoExito() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copiado, setCopiado] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const status = (
      searchParams.get("status") ||
      searchParams.get("collection_status") ||
      ""
    ).toLowerCase();

    const pId = searchParams.get("payment_id") || searchParams.get("collection_id") || "";
    const extRef = searchParams.get("external_reference") || "";

    if (status === "rejected" || status === "failure" || status === "null") {
      router.replace(`/pago/error?payment_id=${pId}&external_reference=${extRef}`);
      return;
    }

    if (status === "pending" || status === "in_process") {
      router.replace(`/pago/pendiente?payment_id=${pId}&external_reference=${extRef}`);
      return;
    }
  }, [searchParams, router]);

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

  // Parámetros que envía Mercado Pago (o valores por defecto si se ingresa directamente por URL)
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id") || "MP-98421034";
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
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-400 text-white flex items-center justify-center shadow-lg">
              <Check className="w-12 h-12 sm:w-14 sm:h-14 stroke-[3.5]" />
            </div>
            <span className="text-lg sm:text-xl font-black text-ink tracking-tight">
              ¡Pago Aprobado!
            </span>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-in fade-in duration-500">
        {/* ── SECCIÓN PRINCIPAL DE ÉXITO (SIN BORDES NI CONTENEDOR VISIBLE) ── */}
        <section className="text-center space-y-6">
          {/* Ícono de Éxito: Círculo verde claro sólido con check blanco */}
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-400 text-white flex items-center justify-center">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
            </div>
          </div>

        {/* Títulos */}
        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight">
            ¡Pago Aprobado con Éxito!
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            Tu pago fue procesado correctamente a través de <strong className="text-ink">Mercado Pago</strong>. Tu pedido ya se encuentra registrado y en proceso de preparación.
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
            <span className="text-xs sm:text-base font-black text-emerald-500 block truncate">
              Aprobado
            </span>
          </div>
        </div>
      </section>

      {/* ── LÍNEA DE TIEMPO DEL PEDIDO (SEAMLESS / SIN CONTENEDOR CON BORDE) ── */}
      <section className="space-y-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-base sm:text-lg font-black text-ink tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <span>Seguimiento del Pedido</span>
          </h2>
          <span className="text-xs font-bold text-primary bg-primary-tint px-3 py-1 rounded-full">
            En Preparación
          </span>
        </div>

        {/* Tracker Horizontal de 4 Pasos (Siempre en 1 Fila en Mobile y Desktop) */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 md:gap-6">
          {/* Paso 1: Pago Confirmado */}
          <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-500/5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-400 text-white flex items-center justify-center font-bold shrink-0">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div className="w-full">
              <span className="text-[10px] sm:text-xs md:text-sm font-black text-ink block leading-tight truncate">
                1. Pago
              </span>
              <span className="text-[9px] sm:text-[11px] text-emerald-600 font-bold block truncate">
                Completado
              </span>
            </div>
          </div>

          {/* Paso 2: Armado (Activo) */}
          <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-primary-tint/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary text-surface flex items-center justify-center font-bold shadow-xs animate-pulse shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="w-full">
              <span className="text-[10px] sm:text-xs md:text-sm font-black text-ink block leading-tight truncate">
                2. Armado
              </span>
              <span className="text-[9px] sm:text-[11px] text-primary font-bold block truncate">
                En Proceso
              </span>
            </div>
          </div>

          {/* Paso 3: Despachado */}
          <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-surface-alt/30 opacity-60">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-surface-alt text-ink-secondary flex items-center justify-center font-bold shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="w-full">
              <span className="text-[10px] sm:text-xs md:text-sm font-bold text-ink block leading-tight truncate">
                3. Envío
              </span>
              <span className="text-[9px] sm:text-[11px] text-ink-secondary block truncate">
                Pendiente
              </span>
            </div>
          </div>

          {/* Paso 4: Entregado */}
          <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-surface-alt/30 opacity-60">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-surface-alt text-ink-secondary flex items-center justify-center font-bold shrink-0">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="w-full">
              <span className="text-[10px] sm:text-xs md:text-sm font-bold text-ink block leading-tight truncate">
                4. Entrega
              </span>
              <span className="text-[9px] sm:text-[11px] text-ink-secondary block truncate">
                Final
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTONES DE ACCIÓN (CTAS) ──────────────────────────────── */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-6 border-t border-border/50">
        <Link
          href="/productos"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-primary hover:bg-primary-hover text-surface font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer text-center"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Seguir Explorando Productos</span>
        </Link>

        <Link
          href="/perfil"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-alt hover:bg-surface-alt/80 text-ink font-bold text-xs sm:text-sm rounded-xl transition-all text-center cursor-pointer"
        >
          <FileCheck2 className="w-4 h-4 text-ink-secondary" />
          <span>Ver Mis Datos y Pedidos</span>
        </Link>
      </section>
      </main>
    </>
  );
}

export default function PagoExitoPage() {
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
        <ContenidoPagoExito />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}

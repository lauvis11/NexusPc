"use client";

import Image from "next/image";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useCarritoStore } from "@/features/carrito/store/store";
import type { ResumenCheckoutProps } from "../types/ordenes";
import { formatearPrecio } from "@/shared/utils/format";

export function ResumenCheckout({ onPagar, loading = false, disabled = false }: ResumenCheckoutProps) {
  const { items, total, totalItems } = useCarritoStore();

  // Calcular precio original sin ofertas y ahorro total
  const totalOriginal = items.reduce((acc, item) => acc + Number(item.precio) * item.cantidad, 0);
  const totalAhorro = Math.max(0, totalOriginal - total);
  const costoEnvio = 0; // Envío Gratis

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-7 space-y-6 shadow-2xs sticky top-28">
      {/* ── HEADER DEL RESUMEN ───────────────────────────────────── */}
      <div className="flex justify-between items-center border-b border-border/60 pb-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight">
          Resumen de Compra
        </h2>
        <span className="text-xs font-bold text-ink-secondary bg-surface-alt px-2.5 py-1 rounded-full border border-border">
          {totalItems} {totalItems === 1 ? "producto" : "productos"}
        </span>
      </div>

      {/* ── LISTA MINIATURA DE PRODUCTOS ─────────────────────────── */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => {
          const imagenUrl = item.img_url || "/placeholder-product.svg";
          const precioOriginalItem = Number(item.precio) * item.cantidad;

          return (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
              <div className="relative w-12 h-12 rounded-xl bg-surface-alt border border-border p-1 shrink-0 flex items-center justify-center overflow-hidden">
                <Image
                  src={imagenUrl}
                  alt={item.nombre}
                  width={48}
                  height={48}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-ink truncate leading-tight">
                  {item.nombre}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-semibold text-ink-secondary">
                    Cant: {item.cantidad}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs sm:text-sm font-extrabold text-ink block">
                  {formatearPrecio(precioOriginalItem)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DESGLOSE DE PRECIOS ──────────────────────────────────── */}
      <div className="space-y-2.5 text-xs sm:text-sm border-t border-border/60 pt-4">
        <div className="flex justify-between text-ink-secondary">
          <span>Subtotal</span>
          <span className="font-bold text-ink">{formatearPrecio(totalOriginal)}</span>
        </div>

        {totalAhorro > 0 && (
          <div className="flex justify-between text-ink-secondary">
            <span>Ahorro en ofertas</span>
            <span className="font-bold text-emerald-600">
              -{formatearPrecio(totalAhorro)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-ink-secondary">
          <span>Envío a domicilio</span>
          <span className="font-bold text-emerald-600">
            {costoEnvio === 0 ? "Gratis" : formatearPrecio(costoEnvio)}
          </span>
        </div>
      </div>

      {/* ── TOTAL FINAL ──────────────────────────────────────────── */}
      <div className="border-t border-border/60 pt-4 space-y-1">
        <div className="flex justify-between items-baseline">
          <span className="font-extrabold text-base text-ink">Total a pagar</span>
          <div className="text-right">
            <span className="font-black text-2xl sm:text-3xl text-primary tracking-tight block">
              {formatearPrecio(total)}
            </span>
            <span className="text-[11px] text-ink-secondary font-medium">
              IVA incluido
            </span>
          </div>
        </div>
      </div>

      {/* ── BOTÓN DE PAGO ────────────────────────────────────────── */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onPagar}
          disabled={disabled || loading || items.length === 0}
          className="w-full py-4 px-6 bg-primary hover:bg-primary-hover text-surface font-extrabold text-sm sm:text-base rounded-xl active:scale-98 transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Procesando compra...</span>
            </>
          ) : (
            <span>Comprar</span>
          )}
        </button>

        <p className="text-[11px] text-center text-ink-secondary">
          Serás redirigido a la pasarela de Mercado Pago para finalizar la compra
        </p>
      </div>

      {/* ── GARANTÍA Y SEGURIDAD ─────────────────────────────────── */}
      <div className="pt-2 border-t border-border/40 space-y-2 text-xs text-ink-secondary">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Compra 100% protegida por Mercado Pago</span>
        </div>
      </div>
    </div>
  );
}

export default ResumenCheckout;

"use client";

import { useState } from "react";
import { ArrowRight, Tag } from "lucide-react";

interface ResumenCompraProps {
  subtotal?: number;
  costoEnvio?: number;
  descuento?: number;
  onProceedToCheckout?: () => void;
}

const formatearPrecio = (valor: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

export function ResumenCompra({
  subtotal = 2836000,
  costoEnvio = 0,
  descuento = 0,
  onProceedToCheckout,
}: ResumenCompraProps) {
  const [codigoCupon, setCodigoCupon] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState(false);

  const total = Math.max(0, subtotal + costoEnvio - descuento);

  const handleAplicarCupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigoCupon.trim()) {
      setCuponAplicado(true);
    }
  };

  return (
    <div className="bg-primary-tint/50 border border-primary/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
      <h2 className="text-xl font-extrabold text-ink tracking-tight border-b border-primary/20 pb-4">
        Resumen de Compra
      </h2>

      {/* Desglose de Precios */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-ink-secondary">
          <span>Subtotal</span>
          <span className="font-bold text-ink">{formatearPrecio(subtotal)}</span>
        </div>

        <div className="flex justify-between text-ink-secondary">
          <span>Envío estimado</span>
          <span className="font-bold text-emerald-600">
            {costoEnvio === 0 ? "Gratis" : formatearPrecio(costoEnvio)}
          </span>
        </div>

        {descuento > 0 && (
          <div className="flex justify-between text-ink-secondary">
            <span>Descuentos</span>
            <span className="font-bold text-emerald-600">
              -{formatearPrecio(descuento)}
            </span>
          </div>
        )}
      </div>

      {/* Código de Descuento */}
      <form onSubmit={handleAplicarCupon} className="space-y-2 pt-2">
        <label className="text-xs font-bold text-ink-secondary uppercase tracking-wider block">
          Código de Descuento
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-ink-secondary/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ingresa tu cupón"
              value={codigoCupon}
              onChange={(e) => setCodigoCupon(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-surface border border-border rounded-xl text-xs font-semibold text-ink focus:border-primary outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-surface border border-border hover:border-primary text-ink hover:text-primary font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
          >
            Aplicar
          </button>
        </div>
        {cuponAplicado && (
          <p className="text-[11px] text-emerald-600 font-semibold">
            ✓ Cupón aplicado con éxito
          </p>
        )}
      </form>

      {/* Total de la Compra */}
      <div className="border-t border-border/80 pt-4 space-y-1">
        <div className="flex justify-between items-baseline">
          <span className="font-extrabold text-base sm:text-lg text-ink">Total</span>
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

      {/* Botón Finalizar Compra */}
      <button
        onClick={onProceedToCheckout}
        className="w-full py-4 px-6 bg-primary text-surface font-extrabold text-sm sm:text-base rounded-xl hover:bg-primary-hover active:scale-98 transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
      >
        <span>Finalizar Compra</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default ResumenCompra;

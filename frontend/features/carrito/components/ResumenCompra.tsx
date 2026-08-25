"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, ShieldCheck } from "lucide-react";
import { useCarritoStore } from "../store/store";
import { useAuth } from "@/features/auth/context/auth-context";
import { formatearPrecio } from "@/shared/utils/format";

export function ResumenCompra() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, totalItems } = useCarritoStore();

  const [codigoCupon, setCodigoCupon] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState(false);

  // Calcular precio original sin descuentos y ahorro total
  const totalOriginal = items.reduce((acc, item) => acc + Number(item.precio) * item.cantidad, 0);
  const totalAhorro = Math.max(0, totalOriginal - total);
  const costoEnvio = 0; // Envío gratis o calculado posteriormente

  const handleAplicarCupon = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (codigoCupon.trim()) {
      setCuponAplicado(true);
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;

    if (!user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="bg-primary-tint/50 border border-primary/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs sticky top-28">
      <div className="flex justify-between items-center border-b border-primary/20 pb-4">
        <h2 className="text-xl font-extrabold text-ink tracking-tight">
          Resumen de Compra
        </h2>
        <span className="text-xs font-bold text-ink-secondary bg-surface px-2.5 py-1 rounded-full border border-border">
          {totalItems} {totalItems === 1 ? "unidad" : "unidades"}
        </span>
      </div>

      {/* Desglose de Precios */}
      <div className="space-y-3 text-sm">
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
          <span>Envío estimado</span>
          <span className="font-bold text-emerald-600">
            {costoEnvio === 0 ? "Gratis" : formatearPrecio(costoEnvio)}
          </span>
        </div>
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
      <div className="border-t border-primary/20 pt-4 space-y-1">
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

      {/* Botón Ir a Checkout */}
      <button
        onClick={handleProceedToCheckout}
        disabled={items.length === 0}
        className="w-full py-4 px-6 bg-primary text-surface font-extrabold text-sm sm:text-base rounded-xl hover:bg-primary-hover active:scale-98 transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Iniciar Compra</span>
      </button>

      {/* Garantía y Seguridad */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs text-ink-secondary font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Compra 100% segura y garantizada</span>
      </div>
    </div>
  );
}

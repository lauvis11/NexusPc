"use client";

import { Truck, CreditCard, ShieldCheck } from "lucide-react";

export function Beneficios() {
  return (
    <section className="w-full py-4 sm:py-8 border-b border-border/40 bg-surface-alt/60">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-6">

          {/* Envíos */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-xl bg-surface border border-border/50 shadow-2xs">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary-tint flex items-center justify-center text-primary shrink-0">
              <Truck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-bold text-ink text-xs sm:text-base leading-snug">
                Envíos a todo el país
              </h4>
              <p className="text-[10px] sm:text-xs text-ink-secondary mt-0.5 leading-tight">
                Despachos rápidos a tu puerta.
              </p>
            </div>
          </div>

          {/* 12 Cuotas */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-xl bg-surface border border-border/50 shadow-2xs">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary-tint flex items-center justify-center text-primary shrink-0">
              <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-bold text-ink text-xs sm:text-base leading-snug">
                12 Cuotas Fijas
              </h4>
              <p className="text-[10px] sm:text-xs text-ink-secondary mt-0.5 leading-tight">
                Todas las tarjetas de crédito.
              </p>
            </div>
          </div>

          {/* Garantía */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-xl bg-surface border border-border/50 shadow-2xs">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary-tint flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-bold text-ink text-xs sm:text-base leading-snug">
                Garantía Oficial
              </h4>
              <p className="text-[10px] sm:text-xs text-ink-secondary mt-0.5 leading-tight">
                Productos 100% originales.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Beneficios;
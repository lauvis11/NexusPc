"use client";

import { Truck, CreditCard, ShieldCheck } from "lucide-react";

export function Beneficios() {
  return (
    <section className="w-full py-8 border-b border-border/40 bg-surface-alt/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-surface border border-border/50 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-primary-tint flex items-center justify-center text-primary shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-ink text-sm sm:text-base">Envíos a todo el país</h4>
              <p className="text-xs text-ink-secondary mt-0.5">Despachos rápidos y asegurados a tu puerta.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-surface border border-border/50 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-primary-tint flex items-center justify-center text-primary shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-ink text-sm sm:text-base">12 Cuotas Fijas</h4>
              <p className="text-xs text-ink-secondary mt-0.5">Aceptamos todas las tarjetas de crédito.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-surface border border-border/50 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-primary-tint flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-ink text-sm sm:text-base">Garantía Oficial NexusPC</h4>
              <p className="text-xs text-ink-secondary mt-0.5">Componentes 100% originales de marcas líderes.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Beneficios;
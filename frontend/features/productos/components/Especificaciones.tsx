"use client";

import { CheckCircle2 } from "lucide-react";
import type { Producto } from "../types/types";

interface EspecificacionesProps {
  caracteristicas?: Producto["caracteristicas"];
  descripcion?: string;
  nombre?: string;
}

export function Especificaciones({
  caracteristicas = [],
  descripcion,
}: EspecificacionesProps) {
  return (
    <section className="w-full space-y-8 sm:space-y-10 pt-6 sm:pt-10 border-t border-border/60">
      {/* ── DESCRIPCIÓN (SIEMPRE VISIBLE ARRIBA) ── */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-2xl font-black text-ink tracking-tight">
          Descripción del Producto
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xs p-5 sm:p-7">
          <p className="font-medium text-ink-secondary text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {descripcion ||
              "Componente de alto rendimiento diseñado específicamente para entusiastas y profesionales del hardware."}
          </p>
        </div>
      </div>

      {/* ── ESPECIFICACIONES TÉCNICAS (DEBAJO DE LA DESCRIPCIÓN) ── */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-2xl font-black text-ink tracking-tight">
          Especificaciones Técnicas
        </h2>

        {caracteristicas && caracteristicas.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-tint/60 border-b border-border/60">
                  <th className="py-3.5 px-4 sm:px-6 font-extrabold text-xs sm:text-sm text-primary uppercase tracking-wider text-left w-1/2">
                    Característica
                  </th>
                  <th className="py-3.5 px-4 sm:px-6 font-extrabold text-xs sm:text-sm text-primary uppercase tracking-wider text-right w-1/2">
                    Especificación
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {caracteristicas.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-surface" : "bg-surface-alt/50"}
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-ink text-xs sm:text-sm text-left">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{item.clave}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-ink text-xs sm:text-sm text-right">
                      {item.valor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <p className="text-xs sm:text-sm text-ink-secondary">
              No hay especificaciones disponibles para este producto.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


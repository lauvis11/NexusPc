"use client";

import { useState } from "react";
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
  nombre,
}: EspecificacionesProps) {
  const [activeTab, setActiveTab] = useState<"descripcion" | "especificaciones">("especificaciones");

  return (
    <section className="w-full space-y-6 pt-6 sm:pt-10 border-t border-border/60">
      {/* Pestañas de Navegación (Tabs) */}
      <div className="border-b border-border/60 flex gap-6 sm:gap-10 relative overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab("especificaciones")}
          className={`pb-3.5 text-lg sm:text-xl font-bold transition-all relative cursor-pointer ${
            activeTab === "especificaciones"
              ? "text-primary font-black border-b-2 border-primary"
              : "text-ink-secondary hover:text-primary border-b-2 border-transparent"
          }`}
        >
          Especificaciones
        </button>

        <button
          onClick={() => setActiveTab("descripcion")}
          className={`pb-3.5 text-lg sm:text-xl font-bold transition-all relative cursor-pointer ${
            activeTab === "descripcion"
              ? "text-primary font-black border-b-2 border-primary"
              : "text-ink-secondary hover:text-primary border-b-2 border-transparent"
          }`}
        >
          Descripción
        </button>
      </div>

      {/* Contenido Pestaña: Especificaciones */}
      {activeTab === "especificaciones" && (
        <div className="py-2">
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
            <p className="text-xs sm:text-sm text-ink-secondary py-4">
              No hay especificaciones disponibles para este producto.
            </p>
          )}
        </div>
      )}

      {/* Contenido Pestaña: Descripción */}
      {activeTab === "descripcion" && (
        <div className="py-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-tint/60 border-b border-border/60">
                  <th className="py-3.5 px-4 sm:px-6 font-extrabold text-xs sm:text-sm text-primary uppercase tracking-wider">
                    Descripción del Producto
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-surface">
                  <td className="py-5 px-4 sm:px-6 font-medium text-ink-secondary text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {descripcion ||
                      "Procesador y componente de alto rendimiento diseñado específicamente para entusiastas y profesionales del hardware."}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default Especificaciones;

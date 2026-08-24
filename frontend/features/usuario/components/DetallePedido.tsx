"use client";

import { ArrowLeft } from "lucide-react";
import type { Orden } from "@/features/ordenes/types/ordenes";
import { formatearPrecio } from "@/shared/utils/format";

interface DetallePedidoProps {
  order: Orden;
  onVolver: () => void;
}

export function DetallePedido({ order, onVolver }: DetallePedidoProps) {
  const totalNum = Number(order.total);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Botón Volver & Título */}
      <div className="pb-6 border-b border-border/50 space-y-4">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-primary hover:text-primary-hover transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Volver a Mis Compras</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Pedido #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-xs text-ink-secondary mt-1">
              ID completo: <span className="font-mono">{order.id}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-ink-secondary block font-bold">Total del Pedido</span>
            <span className="text-xl sm:text-2xl font-black text-primary">
              {formatearPrecio(totalNum)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabla de Artículos */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-surface-alt/70 border-b border-border text-xs font-black uppercase tracking-wider text-ink-secondary">
                <th className="px-5 py-4 text-left">Artículo</th>
                <th className="px-5 py-4 text-center">Precio Unitario</th>
                <th className="px-5 py-4 text-center">Cantidad</th>
                <th className="px-5 py-4 text-center">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {order.productos?.map((item, idx) => {
                const precioNum = Number(item.precio_unitario);
                const subtotal = precioNum * item.cantidad;
                return (
                  <tr key={idx} className="hover:bg-surface-alt/30 transition-colors">
                    {/* Artículo */}
                    <td className="px-5 py-4 text-left font-bold text-ink text-sm">
                      {item.nombre}
                    </td>

                    {/* Precio Unitario */}
                    <td className="px-5 py-4 text-center text-xs sm:text-sm font-medium text-ink-secondary whitespace-nowrap">
                      {formatearPrecio(precioNum)}
                    </td>

                    {/* Cantidad */}
                    <td className="px-5 py-4 text-center font-bold text-ink text-sm whitespace-nowrap">
                      {item.cantidad}
                    </td>

                    {/* Subtotal */}
                    <td className="px-5 py-4 text-center font-extrabold text-ink text-sm whitespace-nowrap">
                      {formatearPrecio(subtotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DetallePedido;
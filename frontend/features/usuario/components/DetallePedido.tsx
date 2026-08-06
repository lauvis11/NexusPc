"use client";

import { ArrowLeft } from "lucide-react";

export interface OrderItem {
  id: string;
  fecha: string;
  estado: "Entregado" | "En camino" | "Pendiente" | "Cancelado";
  total: number;
  items: Array<{ nombre: string; cantidad: number; precio: number }>;
}

interface DetallePedidoProps {
  order: OrderItem;
  onVolver: () => void;
}

export function DetallePedido({ order, onVolver }: DetallePedidoProps) {
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

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Pedido {order.id}
          </h1>
        </div>
      </div>

      {/* Tabla de Artículos */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-surface-alt/70 border-b border-border text-xs font-black uppercase tracking-wider text-ink-secondary">
                <th className="px-5 py-4 text-left">Artículos</th>
                <th className="px-5 py-4 text-center">Precio</th>
                <th className="px-5 py-4 text-center">Cantidad</th>
                <th className="px-5 py-4 text-center">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {order.items.map((item, idx) => {
                const subtotal = item.precio * item.cantidad;
                return (
                  <tr key={idx} className="hover:bg-surface-alt/30 transition-colors">
                    {/* Artículos */}
                    <td className="px-5 py-4 text-left font-bold text-ink text-sm">
                      {item.nombre}
                    </td>

                    {/* Precio */}
                    <td className="px-5 py-4 text-center text-xs sm:text-sm font-medium text-ink-secondary whitespace-nowrap">
                      ${item.precio.toLocaleString("es-AR")}
                    </td>

                    {/* Cantidad */}
                    <td className="px-5 py-4 text-center font-bold text-ink text-sm whitespace-nowrap">
                      {item.cantidad}
                    </td>

                    {/* Subtotal */}
                    <td className="px-5 py-4 text-center font-extrabold text-ink text-sm whitespace-nowrap">
                      ${subtotal.toLocaleString("es-AR")}
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

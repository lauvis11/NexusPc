"use client";

import { useState } from "react";
import { Eye, FileText, CheckCircle2, Truck, Clock, XCircle } from "lucide-react";
import { DetallePedido, type OrderItem } from "./DetallePedido";

const MOCK_ORDERS: OrderItem[] = [
  {
    id: "#NX-90411",
    fecha: "Hoy, 10:45 AM",
    estado: "Pendiente",
    total: 312000,
    items: [
      { nombre: 'Placa de Video NVIDIA RTX 4070 12GB', cantidad: 1, precio: 280000 },
      { nombre: 'Fuente 750W 80 Plus Gold', cantidad: 1, precio: 32000 },
    ],
  },
  {
    id: "#NX-89102",
    fecha: "24 Oct, 2024",
    estado: "En camino",
    total: 450500,
    items: [
      { nombre: 'Procesador Intel Core i7-13700K', cantidad: 1, precio: 390000 },
      { nombre: 'Memoria RAM DDR5 32GB (2x16GB)', cantidad: 1, precio: 60500 },
    ],
  },
  {
    id: "#NX-88234",
    fecha: "12 Oct, 2024",
    estado: "Entregado",
    total: 1249000,
    items: [
      { nombre: 'Notebook Gamer Asus ROG Strix i9 16GB RTX 4080', cantidad: 1, precio: 1249000 },
    ],
  },
  {
    id: "#NX-77621",
    fecha: "15 Sep, 2024",
    estado: "Entregado",
    total: 89990,
    items: [
      { nombre: 'Mouse Gamer Inalámbrico 26000 DPI', cantidad: 1, precio: 59990 },
      { nombre: 'Mousepad XL RGB Control', cantidad: 1, precio: 30000 },
    ],
  },
];

export function MisCompras() {
  const [orders] = useState<OrderItem[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const getStatusBadge = (estado: OrderItem["estado"]) => {
    switch (estado) {
      case "Entregado":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-extrabold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Entregado</span>
          </span>
        );
      case "En camino":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 text-xs font-extrabold">
            <Truck className="w-3.5 h-3.5" />
            <span>En camino</span>
          </span>
        );
      case "Pendiente":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-extrabold">
            <Clock className="w-3.5 h-3.5" />
            <span>Pendiente</span>
          </span>
        );
      case "Cancelado":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs font-extrabold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelado</span>
          </span>
        );
    }
  };

  // Si hay un pedido seleccionado, renderiza la vista de DetallePedido (reemplaza la sección)
  if (selectedOrder) {
    return (
      <DetallePedido
        order={selectedOrder}
        onVolver={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de la Sección */}
      <div className="pb-6 border-b border-border/50">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Historial de Pedidos
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          Revisa el estado de tus compras y descarga tus facturas o comprobantes
        </p>
      </div>

      {/* Tabla de Pedidos Adaptativa */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-surface-alt/70 border-b border-border text-xs font-black uppercase tracking-wider text-ink-secondary">
                <th className="px-5 py-4 text-center"># de Pedido</th>
                <th className="px-5 py-4 text-center">Fecha</th>
                <th className="px-5 py-4 text-center">Estado</th>
                <th className="px-5 py-4 text-center">Total</th>
                <th className="px-5 py-4 text-center">Detalle</th>
                <th className="px-5 py-4 text-center">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-surface-alt/30 transition-colors"
                >
                  {/* # de Pedido */}
                  <td className="px-5 py-4 text-center font-extrabold text-ink text-sm whitespace-nowrap">
                    {order.id}
                  </td>

                  {/* Fecha */}
                  <td className="px-5 py-4 text-center text-xs sm:text-sm font-medium text-ink-secondary whitespace-nowrap">
                    {order.fecha}
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    {getStatusBadge(order.estado)}
                  </td>

                  {/* Total */}
                  <td className="px-5 py-4 text-center font-extrabold text-ink text-sm whitespace-nowrap">
                    ${order.total.toLocaleString("es-AR")}
                  </td>

                  {/* Detalle */}
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver detalle</span>
                    </button>
                  </td>

                  {/* Comprobante */}
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => alert(`Descargando comprobante de ${order.id}...`)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-hover text-surface rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Comprobante</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  FileText,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  ShoppingBag,
  RotateCcw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { DetallePedido } from "./DetallePedido";
import { getMisOrdenes } from "@/features/ordenes/api/ordenes";
import type { Orden } from "@/features/ordenes/types/ordenes";

const formatearPrecio = (valor: number | string) => {
  const num = Number(valor);
  if (isNaN(num)) return "$0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatearFecha = (fechaStr: string) => {
  try {
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(fecha);
  } catch {
    return fechaStr;
  }
};

export function MisCompras() {
  const [orders, setOrders] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getMisOrdenes();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (estado: string) => {
    const estadoUpper = (estado || "").toUpperCase();

    switch (estadoUpper) {
      case "ENTREGADO":
      case "COMPLETADA":
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-extrabold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Entregado</span>
          </span>
        );
      case "APROBADO":
      case "PAGADO":
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-extrabold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pagado</span>
          </span>
        );
      case "EN_ENVIO":
      case "ENVIADO":
      case "EN CAMINO":
        return (
          <span className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-extrabold">
            <Truck className="w-4 h-4 shrink-0" />
            <span>En camino</span>
          </span>
        );
      case "CANCELADO":
      case "CANCELADA":
      case "RECHAZADO":
        return (
          <span className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-extrabold">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>Cancelado</span>
          </span>
        );
      case "PENDIENTE":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-extrabold">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Pendiente</span>
          </span>
        );
    }
  };

  // Si hay un pedido seleccionado, renderiza la vista de DetallePedido
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
          Revisa el estado de tus compras en tiempo real y el detalle de cada producto
        </p>
      </div>

      {/* Estado de Carga */}
      {loading && (
        <div className="p-12 bg-surface rounded-2xl border border-border flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-bold text-ink-secondary">Cargando tus compras...</p>
        </div>
      )}

      {/* Estado de Error */}
      {!loading && error && (
        <div className="p-8 bg-surface rounded-2xl border border-border text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-ink">No pudimos cargar tus pedidos</h3>
            <p className="text-xs text-ink-secondary mt-1">
              Ocurrió un error al consultar el historial. Por favor intentá nuevamente.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-surface rounded-xl text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reintentar</span>
          </button>
        </div>
      )}

      {/* Estado Vacío (Sin Órdenes) */}
      {!loading && !error && orders.length === 0 && (
        <div className="p-12 bg-surface rounded-2xl border border-border text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-tint/60 text-primary flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-ink">Aún no realizaste compras</h3>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              Cuando compres componentes o periféricos, vas a poder seguir el estado de tu pedido acá.
            </p>
          </div>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-surface rounded-xl text-xs sm:text-sm font-extrabold hover:bg-primary-hover transition-all shadow-xs cursor-pointer"
          >
            <span>Explorar Catálogo</span>
          </Link>
        </div>
      )}

      {/* Tabla de Pedidos Adaptativa */}
      {!loading && !error && orders.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-surface-alt/70 border-b border-border text-xs font-black uppercase tracking-wider text-ink-secondary">
                  <th className="px-5 py-4 text-center"># de Pedido</th>
                  <th className="px-5 py-4 text-center">Fecha</th>
                  <th className="px-5 py-4 text-center">Estado</th>
                  <th className="px-5 py-4 text-center">Total</th>
                  <th className="px-5 py-4 text-center">Artículos</th>
                  <th className="px-5 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.map((order) => {
                  const totalArticulos = order.productos?.reduce(
                    (acc, item) => acc + (item.cantidad || 0),
                    0
                  ) ?? 0;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-surface-alt/30 transition-colors"
                    >
                      {/* # de Pedido */}
                      <td className="px-5 py-4 text-center font-extrabold text-ink text-sm whitespace-nowrap">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>

                      {/* Fecha */}
                      <td className="px-5 py-4 text-center text-xs sm:text-sm font-medium text-ink-secondary whitespace-nowrap">
                        {formatearFecha(order.created_at)}
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        {getStatusBadge(order.estado)}
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 text-center font-extrabold text-primary text-sm whitespace-nowrap">
                        {formatearPrecio(order.total)}
                      </td>

                      {/* Cantidad de Artículos */}
                      <td className="px-5 py-4 text-center text-xs font-bold text-ink-secondary whitespace-nowrap">
                        {totalArticulos} {totalArticulos === 1 ? "ítem" : "ítems"}
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver detalle</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisCompras;
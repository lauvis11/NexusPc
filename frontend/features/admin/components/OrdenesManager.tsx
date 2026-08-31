"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Eye,
  CreditCard,
  Package,
  Calendar,
  User,
  Mail,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { EstadoBadge } from "@/shared/components/ui/EstadoBadge";
import { EstadoOrden, Orden } from "@/features/ordenes/types/ordenes";
import { obtenerOrdenes, actualizarEstadoOrden } from "../api/ordenes";

const ESTADO_CONFIG: Record<
  EstadoOrden,
  { label: string; badgeClass: string; icon: typeof Clock }
> = {
  PENDIENTE: {
    label: "Pendiente",
    badgeClass: "bg-warning/15 text-warning border-warning/30",
    icon: Clock,
  },
  PAGADO: {
    label: "Pagado",
    badgeClass: "bg-primary-tint text-primary border-primary/30",
    icon: CreditCard,
  },
  ENVIADO: {
    label: "Enviado",
    badgeClass: "bg-secondary-container/30 text-secondary border-secondary/30",
    icon: Truck,
  },
  COMPLETADA: {
    label: "Completada",
    badgeClass: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
  CANCELADA: {
    label: "Cancelada",
    badgeClass: "bg-danger/15 text-danger border-danger/30",
    icon: XCircle,
  },
};

const TRANSICIONES_VALIDAS: Record<EstadoOrden, EstadoOrden[]> = {
  PENDIENTE: ["PAGADO", "CANCELADA"],
  PAGADO: ["ENVIADO", "CANCELADA"],
  ENVIADO: ["COMPLETADA"],
  COMPLETADA: [],
  CANCELADA: [],
};

export function OrdenesManager() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingEstado, setIsUpdatingEstado] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);

  // Carga inicial de órdenes desde la API
  useEffect(() => {
    async function loadOrdenes() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await obtenerOrdenes();
        setOrdenes(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar las órdenes");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrdenes();
  }, []);

  const filteredOrdenes = ordenes.filter((ord) => {
    const uNombre = ord.usuario_nombre || "";
    const uEmail = ord.usuario_email || "";
    const matchesSearch =
      uNombre.toLowerCase().includes(search.toLowerCase()) ||
      uEmail.toLowerCase().includes(search.toLowerCase()) ||
      ord.id.toLowerCase().includes(search.toLowerCase());
    const matchesEstado =
      filterEstado === "all" || ord.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  const handleUpdateEstado = async (ordenId: string, nuevoEstado: EstadoOrden) => {
    if (isUpdatingEstado) return;

    try {
      setIsUpdatingEstado(true);
      setError(null);
      await actualizarEstadoOrden(ordenId, nuevoEstado);

      setOrdenes((prev) =>
        prev.map((ord) =>
          ord.id === ordenId ? { ...ord, estado: nuevoEstado } : ord
        )
      );

      if (selectedOrden && selectedOrden.id === ordenId) {
        setSelectedOrden((prev) =>
          prev ? { ...prev, estado: nuevoEstado } : null
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar el estado de la orden");
    } finally {
      setIsUpdatingEstado(false);
    }
  };

  const totalRecaudado = ordenes
    .filter((o) => o.estado !== "CANCELADA")
    .reduce((acc, o) => acc + Number(o.total || 0), 0);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            Órdenes y Ventas
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Seguimiento de compras, cobros y cambios de estado de despacho.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Filter by Estado */}
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="pl-3.5 pr-8 py-2 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="PAGADO">Pagadas</option>
            <option value="ENVIADO">Enviadas</option>
            <option value="COMPLETADA">Completadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente, email o ID..."
              className="w-full pl-10 pr-3.5 py-2 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Total Ventas
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-tint text-primary flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-ink mt-2">
            ${totalRecaudado.toLocaleString("es-AR")}
          </p>
          <p className="text-xs text-ink-secondary mt-0.5">
            {ordenes.length} órdenes registradas
          </p>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Por Cobrar
            </span>
            <div className="w-8 h-8 rounded-lg bg-warning/15 text-warning flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-ink mt-2">
            {ordenes.filter((o) => o.estado === "PENDIENTE").length}
          </p>
          <p className="text-xs text-ink-secondary mt-0.5">Pendientes de pago</p>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Por Despachar
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-tint text-primary flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-ink mt-2">
            {ordenes.filter((o) => o.estado === "PAGADO").length}
          </p>
          <p className="text-xs text-ink-secondary mt-0.5">Listas para enviar</p>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Completadas
            </span>
            <div className="w-8 h-8 rounded-lg bg-success/15 text-success flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-ink mt-2">
            {ordenes.filter((o) => o.estado === "COMPLETADA").length}
          </p>
          <p className="text-xs text-ink-secondary mt-0.5">Entregadas con éxito</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-2xl flex items-center justify-between gap-3 text-danger text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:bg-danger/20 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Data Table Card */}
      <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary w-28">
                  Orden
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Cliente
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Ítems
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Fecha
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Total
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary text-center">
                  Estado
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary text-right w-24">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-ink-secondary">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm font-medium">Cargando órdenes...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrdenes.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-ink-secondary text-sm"
                  >
                    No se encontraron órdenes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredOrdenes.map((ord, idx) => {
                  const productos = ord.productos || [];
                  const totalItems = productos.reduce((a, b) => a + Number(b.cantidad || 0), 0);
                  const totalVal = Number(ord.total || 0);

                  return (
                    <tr
                      key={ord.id}
                      className={`transition-colors hover:bg-primary-tint/40 group ${
                        idx % 2 === 1 ? "bg-surface-alt/40" : "bg-surface"
                      }`}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-primary text-xs">
                        #{ord.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-ink leading-tight">
                            {ord.usuario_nombre}
                          </p>
                          {ord.usuario_email && (
                            <p className="text-xs text-ink-secondary leading-tight mt-0.5">
                              {ord.usuario_email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-ink-secondary font-medium">
                          {productos[0]?.nombre || "Sin ítems"}
                          {productos.length > 1 && (
                            <span className="text-primary font-bold ml-1">
                              +{productos.length - 1} más ({totalItems} un.)
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-secondary whitespace-nowrap">
                        {new Date(ord.created_at).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-ink whitespace-nowrap">
                        ${totalVal.toLocaleString("es-AR")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <EstadoBadge estado={ord.estado} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrden(ord)}
                          className="inline-flex items-center gap-1 p-2 text-primary hover:bg-primary-tint rounded-lg transition-colors font-semibold text-xs cursor-pointer"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">Ver</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 flex items-center justify-between border-t border-border bg-surface-alt/60 text-xs text-ink-secondary font-medium">
          <span>
            Mostrando {filteredOrdenes.length} de {ordenes.length} órdenes
          </span>
        </div>
      </div>

      {/* Modal Detalle de Orden */}
      {selectedOrden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrden(null)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-2xl p-6 border border-border z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-primary">
                  ORDEN #{selectedOrden.id.slice(0, 8)}
                </span>
                <h3 className="text-xl font-extrabold text-ink">
                  Detalle de la Orden
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrden(null)}
                className="p-1.5 text-ink-secondary hover:bg-surface-alt rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Change Actions */}
            <div className="p-4 bg-surface-alt rounded-xl border border-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Estado Actual
                </span>
                <EstadoBadge estado={selectedOrden.estado} />
              </div>

              {/* Transición de estados permitida */}
              {TRANSICIONES_VALIDAS[selectedOrden.estado]?.length > 0 ? (
                <div className="pt-2 border-t border-border flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-ink">
                    Cambiar estado a:
                  </span>
                  {TRANSICIONES_VALIDAS[selectedOrden.estado].map((trans) => (
                    <button
                      key={trans}
                      disabled={isUpdatingEstado}
                      onClick={() => handleUpdateEstado(selectedOrden.id, trans)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${
                        trans === "CANCELADA"
                          ? "bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30"
                          : "bg-primary hover:bg-primary-hover text-white shadow-xs"
                      }`}
                    >
                      {isUpdatingEstado && <Loader2 className="w-3 h-3 animate-spin" />}
                      <span>Marcar como {ESTADO_CONFIG[trans]?.label ?? trans}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink-secondary italic pt-1">
                  Esta orden está en estado final ({selectedOrden.estado}) y no permite más cambios.
                </p>
              )}
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3.5 bg-surface rounded-xl border border-border space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-primary" /> Cliente
                </span>
                <p className="font-bold text-ink">{selectedOrden.usuario_nombre}</p>
                {selectedOrden.usuario_email && (
                  <p className="text-xs text-ink-secondary flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {selectedOrden.usuario_email}
                  </p>
                )}
              </div>

              <div className="p-3.5 bg-surface rounded-xl border border-border space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Fecha de Registro
                </span>
                <p className="font-bold text-ink">
                  {new Date(selectedOrden.created_at).toLocaleString("es-AR")}
                </p>
                <p className="text-xs text-ink-secondary">Pago MercadoPago</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
                Productos en la Orden
              </h4>
              <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                {(selectedOrden.productos || []).map((item, i) => {
                  const unitPrice = Number(item.precio_unitario || 0);
                  const itemTotal = Number(item.cantidad || 0) * unitPrice;

                  return (
                    <div
                      key={i}
                      className="p-3.5 flex items-center justify-between bg-surface hover:bg-surface-alt/50 transition-colors text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-tint text-primary flex items-center justify-center font-bold text-xs">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-ink">{item.nombre}</p>
                          <p className="text-xs text-ink-secondary">
                            {item.cantidad} x ${unitPrice.toLocaleString("es-AR")}
                          </p>
                        </div>
                      </div>
                      <span className="font-extrabold text-ink">
                        ${itemTotal.toLocaleString("es-AR")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="font-bold text-ink">Total Facturado</span>
              <span className="text-2xl font-black text-primary">
                ${Number(selectedOrden.total || 0).toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
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
  ChevronRight,
  X,
  AlertTriangle,
} from "lucide-react";
import { EstadoBadge } from "@/shared/components/ui/EstadoBadge";

export type EstadoOrden =
  | "PENDIENTE"
  | "PAGADO"
  | "ENVIADO"
  | "COMPLETADA"
  | "CANCELADA";

interface DetalleProductoMock {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
}

interface OrdenMock {
  id: string;
  usuario_nombre: string;
  usuario_email: string;
  total: number;
  created_at: string;
  estado: EstadoOrden;
  productos: DetalleProductoMock[];
}

const INITIAL_MOCK_ORDENES: OrdenMock[] = [
  {
    id: "9f8a1c24-b234-4e89-9a21-998812345671",
    usuario_nombre: "Lucas Giménez",
    usuario_email: "lucas.gimenez@gmail.com",
    total: 960000,
    created_at: "2026-08-26T11:20:00.000Z",
    estado: "PENDIENTE",
    productos: [
      { nombre: "NVIDIA GeForce RTX 4060 Ti 8GB", cantidad: 2, precio_unitario: 480000 },
    ],
  },
  {
    id: "7e5d2b11-a123-4f90-8b12-887766554432",
    usuario_nombre: "Camila Rodríguez",
    usuario_email: "camila.dev@hotmail.com",
    total: 710000,
    created_at: "2026-08-26T09:45:00.000Z",
    estado: "PAGADO",
    productos: [
      { nombre: "AMD Ryzen 7 7800X3D AM5", cantidad: 1, precio_unitario: 520000 },
      { nombre: "Memoria RAM Corsair 32GB DDR5", cantidad: 1, precio_unitario: 190000 },
    ],
  },
  {
    id: "5c3a9f00-c456-4d12-7a98-776655443321",
    usuario_nombre: "Agustín Fernández",
    usuario_email: "agus.f@gmail.com",
    total: 340000,
    created_at: "2026-08-25T17:15:00.000Z",
    estado: "ENVIADO",
    productos: [
      { nombre: 'Monitor ASUS TUF Gaming 27" 165Hz', cantidad: 1, precio_unitario: 340000 },
    ],
  },
  {
    id: "3b1e8d99-d789-4b34-6c87-665544332210",
    usuario_nombre: "Sofía Martínez",
    usuario_email: "sofia.mtz@yahoo.com",
    total: 135000,
    created_at: "2026-08-24T14:30:00.000Z",
    estado: "COMPLETADA",
    productos: [
      { nombre: "SSD Kingston KC3000 1TB NVMe PCIe 4.0", cantidad: 1, precio_unitario: 135000 },
    ],
  },
  {
    id: "1a0c7e88-e012-4c56-5d76-554433221109",
    usuario_nombre: "Mariano Torres",
    usuario_email: "mtorres@empresa.com",
    total: 480000,
    created_at: "2026-08-23T10:10:00.000Z",
    estado: "CANCELADA",
    productos: [
      { nombre: "NVIDIA GeForce RTX 4060 Ti 8GB", cantidad: 1, precio_unitario: 480000 },
    ],
  },
];

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
  const [ordenes, setOrdenes] = useState<OrdenMock[]>(INITIAL_MOCK_ORDENES);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [selectedOrden, setSelectedOrden] = useState<OrdenMock | null>(null);

  const filteredOrdenes = ordenes.filter((ord) => {
    const matchesSearch =
      ord.usuario_nombre.toLowerCase().includes(search.toLowerCase()) ||
      ord.usuario_email.toLowerCase().includes(search.toLowerCase()) ||
      ord.id.toLowerCase().includes(search.toLowerCase());
    const matchesEstado =
      filterEstado === "all" || ord.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  const handleUpdateEstado = (ordenId: string, nuevoEstado: EstadoOrden) => {
    setOrdenes((prev) =>
      prev.map((ord) =>
        ord.id === ordenId ? { ...ord, estado: nuevoEstado } : ord
      )
    );
    if (selectedOrden && selectedOrden.id === ordenId) {
      setSelectedOrden((prev) => (prev ? { ...prev, estado: nuevoEstado } : null));
    }
  };

  const totalRecaudado = ordenes
    .filter((o) => o.estado !== "CANCELADA")
    .reduce((acc, o) => acc + o.total, 0);

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
              {filteredOrdenes.length === 0 ? (
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
                  const estadoCfg = ESTADO_CONFIG[ord.estado];
                  const Icon = estadoCfg.icon;
                  const totalItems = ord.productos.reduce((a, b) => a + b.cantidad, 0);

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
                          <p className="text-xs text-ink-secondary leading-tight mt-0.5">
                            {ord.usuario_email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-ink-secondary font-medium">
                          {ord.productos[0]?.nombre}
                          {ord.productos.length > 1 && (
                            <span className="text-primary font-bold ml-1">
                              +{ord.productos.length - 1} más ({totalItems} un.)
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
                        ${ord.total.toLocaleString("es-AR")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <EstadoBadge estado={ord.estado} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrden(ord)}
                          className="inline-flex items-center gap-1 p-2 text-primary hover:bg-primary-tint rounded-lg transition-colors font-semibold text-xs"
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
                className="p-1.5 text-ink-secondary hover:bg-surface-alt rounded-lg transition-colors"
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
              {TRANSICIONES_VALIDAS[selectedOrden.estado].length > 0 ? (
                <div className="pt-2 border-t border-border flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-ink">
                    Cambiar estado a:
                  </span>
                  {TRANSICIONES_VALIDAS[selectedOrden.estado].map((trans) => (
                    <button
                      key={trans}
                      onClick={() => handleUpdateEstado(selectedOrden.id, trans)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        trans === "CANCELADA"
                          ? "bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30"
                          : "bg-primary hover:bg-primary-hover text-white shadow-xs"
                      }`}
                    >
                      Marcar como {ESTADO_CONFIG[trans].label}
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
                <p className="text-xs text-ink-secondary flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {selectedOrden.usuario_email}
                </p>
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
                {selectedOrden.productos.map((item, i) => (
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
                          {item.cantidad} x ${item.precio_unitario.toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-ink">
                      ${(item.cantidad * item.precio_unitario).toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="font-bold text-ink">Total Facturado</span>
              <span className="text-2xl font-black text-primary">
                ${selectedOrden.total.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Loader2,
  Users,
} from "lucide-react";
import { EstadoBadge } from "@/shared/components/ui/EstadoBadge";
import { Orden } from "@/features/ordenes/types/ordenes";
import { obtenerOrdenes } from "@/features/admin/api/ordenes";
import { getProductos } from "@/features/productos/api/productos";
import { obtenerOfertas } from "@/features/admin/api/ofertas";
import { obtenerUsuarios } from "@/features/admin/api/usuarios";
import { API_URL } from "@/lib/constants";

export default function AdminDashboardPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [totalProductos, setTotalProductos] = useState<number>(0);
  const [totalOfertasActivas, setTotalOfertasActivas] = useState<number>(0);
  const [totalUsuarios, setTotalUsuarios] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const [ordenesRes, prodsRes, ofertasRes, usuariosRes] =
          await Promise.allSettled([
            obtenerOrdenes(),
            getProductos(`${API_URL}/productos?limit=100`, 0),
            obtenerOfertas(),
            obtenerUsuarios(),
          ]);

        if (ordenesRes.status === "fulfilled") {
          setOrdenes(ordenesRes.value);
        }
        if (prodsRes.status === "fulfilled") {
          setTotalProductos(prodsRes.value.pagination?.total || prodsRes.value.data.length);
        }
        if (ofertasRes.status === "fulfilled") {
          setTotalOfertasActivas(ofertasRes.value.filter((o) => o.activo).length);
        }
        if (usuariosRes.status === "fulfilled") {
          setTotalUsuarios(usuariosRes.value.length);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Órdenes activas (todas excepto las ya completadas o canceladas)
  const ordenesActivas = ordenes.filter(
    (o) => o.estado !== "COMPLETADA" && o.estado !== "CANCELADA"
  );
  const ultimasOrdenes = ordenes.slice(0, 6);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-ink tracking-tight">
          Panel de Control
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          Resumen general del estado de NexusPC.
        </p>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Órdenes Activas (En proceso / Sin completar) */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
            Órdenes Activas
          </span>
          <p className="text-2xl font-black text-ink mt-2">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              ordenesActivas.length
            )}
          </p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-warning" /> En proceso de entrega
          </p>
        </div>

        {/* Productos Activos */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
            Productos
          </span>
          <p className="text-2xl font-black text-ink mt-2">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              totalProductos
            )}
          </p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" /> En catálogo activo
          </p>
        </div>

        {/* Ofertas Activas */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
            Ofertas Activas
          </span>
          <p className="text-2xl font-black text-ink mt-2">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              totalOfertasActivas
            )}
          </p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-primary" /> Promociones vigentes
          </p>
        </div>

        {/* Usuarios Registrados */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
            Usuarios
          </span>
          <p className="text-2xl font-black text-ink mt-2">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              totalUsuarios
            )}
          </p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-success" /> Cuentas registradas
          </p>
        </div>
      </div>

      {/* Tabla de Últimas 6 Órdenes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Últimas Órdenes</h2>
          </div>

          <Link
            href="/admin/ordenes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors group"
          >
            <span>Ver todas las órdenes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-alt">
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary w-28">
                    ID
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                    Cliente
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                    Productos
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                    Fecha
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                    Total
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary text-right">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-ink-secondary">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span className="text-sm font-medium">Cargando órdenes...</span>
                      </div>
                    </td>
                  </tr>
                ) : ultimasOrdenes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-ink-secondary text-sm"
                    >
                      No hay órdenes registradas en el sistema.
                    </td>
                  </tr>
                ) : (
                  ultimasOrdenes.map((ord, idx) => {
                    const productos = ord.productos || [];
                    const resumen = productos[0]?.nombre || "Sin ítems";
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
                        <td className="px-6 py-4 text-xs font-medium text-ink-secondary">
                          {resumen}
                          {productos.length > 1 && ` + ${productos.length - 1} más`}
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
                        <td className="px-6 py-4 text-right">
                          <EstadoBadge estado={ord.estado} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer de la tabla */}
          <div className="px-6 py-3.5 flex items-center justify-between border-t border-border bg-surface-alt/60 text-xs text-ink-secondary font-medium">
            <span>
              Mostrando las últimas {ultimasOrdenes.length} órdenes registradas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { EstadoBadge, type EstadoOrdenTipo } from "@/shared/components/ui/EstadoBadge";

interface OrdenRecienteMock {
  id: string;
  usuario_nombre: string;
  usuario_email: string;
  productos_resumen: string;
  total: number;
  created_at: string;
  estado: EstadoOrdenTipo;
}

const RECENT_ORDERS_MOCK: OrdenRecienteMock[] = [
  {
    id: "9f8a1c24-b234-4e89-9a21-998812345671",
    usuario_nombre: "Lucas Giménez",
    usuario_email: "lucas.gimenez@gmail.com",
    productos_resumen: "NVIDIA RTX 4060 Ti 8GB (x2)",
    total: 960000,
    created_at: "2026-08-27T09:40:00.000Z",
    estado: "PENDIENTE",
  },
  {
    id: "7e5d2b11-a123-4f90-8b12-887766554432",
    usuario_nombre: "Camila Rodríguez",
    usuario_email: "camila.dev@hotmail.com",
    productos_resumen: "AMD Ryzen 7 7800X3D + 1 más",
    total: 710000,
    created_at: "2026-08-27T08:15:00.000Z",
    estado: "PAGADO",
  },
  {
    id: "5c3a9f00-c456-4d12-7a98-776655443321",
    usuario_nombre: "Agustín Fernández",
    usuario_email: "agus.f@gmail.com",
    productos_resumen: 'Monitor ASUS TUF 27" 165Hz (x1)',
    total: 340000,
    created_at: "2026-08-26T19:30:00.000Z",
    estado: "ENVIADO",
  },
  {
    id: "3b1e8d99-d789-4b34-6c87-665544332210",
    usuario_nombre: "Sofía Martínez",
    usuario_email: "sofia.mtz@yahoo.com",
    productos_resumen: "SSD Kingston KC3000 1TB (x1)",
    total: 135000,
    created_at: "2026-08-26T15:20:00.000Z",
    estado: "COMPLETADA",
  },
  {
    id: "2d4f8a77-c901-4e23-8b54-443322110099",
    usuario_nombre: "Ignacio Benítez",
    usuario_email: "nacho.b@gmail.com",
    productos_resumen: "RAM Corsair 32GB DDR5 6000MHz (x1)",
    total: 190000,
    created_at: "2026-08-26T11:05:00.000Z",
    estado: "PAGADO",
  },
  {
    id: "1a0c7e88-e012-4c56-5d76-554433221109",
    usuario_nombre: "Mariano Torres",
    usuario_email: "mtorres@empresa.com",
    productos_resumen: "NVIDIA RTX 4060 Ti 8GB (x1)",
    total: 480000,
    created_at: "2026-08-25T14:10:00.000Z",
    estado: "CANCELADA",
  },
];

export default function AdminDashboardPage() {
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
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
            Órdenes
          </span>
          <p className="text-2xl font-black text-ink mt-2">24</p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-warning" /> 5 pendientes de envío
          </p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
            Productos
          </span>
          <p className="text-2xl font-black text-ink mt-2">18</p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" /> En catálogo activo
          </p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
            Ofertas Activas
          </span>
          <p className="text-2xl font-black text-ink mt-2">4</p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-primary" /> Promociones activas
          </p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary block">
            Usuarios
          </span>
          <p className="text-2xl font-black text-ink mt-2">156</p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Clientes registrados
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
                {RECENT_ORDERS_MOCK.map((ord, idx) => (
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
                      <td className="px-6 py-4 text-xs font-medium text-ink-secondary">
                        {ord.productos_resumen}
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
                      <td className="px-6 py-4 text-right">
                        <EstadoBadge estado={ord.estado} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Footer de la tabla */}
          <div className="px-6 py-3.5 flex items-center justify-between border-t border-border bg-surface-alt/60 text-xs text-ink-secondary font-medium">
            <span>Mostrando las últimas 6 órdenes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

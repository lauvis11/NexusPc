import Link from "next/link";
import {
  Package,
  Layers,
  ShoppingBag,
  Tag,
  Users,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-ink tracking-tight">
            Panel de Control
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Bienvenido al centro de administración de NexusPC.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/productos"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs lg:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-primary/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </Link>
          <Link
            href="/admin/ofertas"
            className="inline-flex items-center gap-2 bg-surface hover:bg-surface-alt text-ink border border-border text-xs lg:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Tag className="w-4 h-4 text-primary" />
            Nueva Oferta
          </Link>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Órdenes
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-ink mt-3">--</p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-warning" /> Pendientes de envío
          </p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Productos
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-ink mt-3">--</p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" /> En catálogo
          </p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Ofertas Activas
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-ink mt-3">--</p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-primary" /> Promociones
          </p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Usuarios
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-ink mt-3">--</p>
          <p className="text-xs text-ink-secondary mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Clientes activos
          </p>
        </div>
      </div>

      {/* Modules Quick Access Cards */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-4">
          Accesos Rápidos a Módulos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/productos"
            className="group bg-surface p-5 rounded-2xl border border-border hover:border-primary transition-all duration-150 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Package className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-ink-secondary group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-ink group-hover:text-primary transition-colors">
              Gestión de Productos
            </h3>
            <p className="text-xs text-ink-secondary mt-1">
              Crear, actualizar precios, stock e imágenes en Cloudinary.
            </p>
          </Link>

          <Link
            href="/admin/ordenes"
            className="group bg-surface p-5 rounded-2xl border border-border hover:border-primary transition-all duration-150 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-ink-secondary group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-ink group-hover:text-primary transition-colors">
              Órdenes y Ventas
            </h3>
            <p className="text-xs text-ink-secondary mt-1">
              Revisar compras, estado de pagos y cambiar estados de envío.
            </p>
          </Link>

          <Link
            href="/admin/categorias"
            className="group bg-surface p-5 rounded-2xl border border-border hover:border-primary transition-all duration-150 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-ink-secondary group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-ink group-hover:text-primary transition-colors">
              Categorías y Subcategorías
            </h3>
            <p className="text-xs text-ink-secondary mt-1">
              Organizar la taxonomía y jerarquías del catálogo.
            </p>
          </Link>

          <Link
            href="/admin/ofertas"
            className="group bg-surface p-5 rounded-2xl border border-border hover:border-primary transition-all duration-150 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Tag className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-ink-secondary group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-ink group-hover:text-primary transition-colors">
              Ofertas y Descuentos
            </h3>
            <p className="text-xs text-ink-secondary mt-1">
              Programar promociones temporales por porcentaje o monto fijo.
            </p>
          </Link>

          <Link
            href="/admin/usuarios"
            className="group bg-surface p-5 rounded-2xl border border-border hover:border-primary transition-all duration-150 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-ink-secondary group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-ink group-hover:text-primary transition-colors">
              Usuarios y Clientes
            </h3>
            <p className="text-xs text-ink-secondary mt-1">
              Listado de cuentas activas y administración de accesos.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

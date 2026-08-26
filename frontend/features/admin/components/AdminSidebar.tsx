"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  Tag,
  ShoppingBag,
  Users,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/context/auth-context";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Productos",
    href: "/admin/productos",
    icon: Package,
  },
  {
    label: "Categorías",
    href: "/admin/categorias",
    icon: Layers,
  },
  {
    label: "Subcategorías",
    href: "/admin/subcategorias",
    icon: FolderTree,
  },
  {
    label: "Ofertas",
    href: "/admin/ofertas",
    icon: Tag,
  },
  {
    label: "Órdenes",
    href: "/admin/ordenes",
    icon: ShoppingBag,
  },
  {
    label: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border text-ink">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-border">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-sm shadow-primary/30 group-hover:bg-primary-hover transition-colors">
            N
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-ink block leading-none">
              Nexus<span className="text-primary">PC</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary-tint px-1.5 py-0.5 rounded mt-0.5 inline-flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> Admin
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-ink-secondary hover:bg-surface-alt transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-ink-secondary mb-2">
          Gestión
        </p>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                active
                  ? "bg-primary text-white shadow-sm shadow-primary/25 font-semibold"
                  : "text-ink-secondary hover:text-ink hover:bg-surface-alt"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  active ? "text-white" : "text-ink-secondary"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer / User Profile & Actions */}
      <div className="p-4 border-t border-border space-y-3 bg-surface">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-ink-secondary hover:text-primary hover:bg-primary-tint rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Ir a la tienda
          </span>
          <span className="text-[10px] bg-border px-1.5 py-0.5 rounded text-ink-secondary font-bold">
            Web
          </span>
        </Link>

        <div className="pt-2 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary-tint text-primary font-bold text-xs flex items-center justify-center shrink-0">
              {user?.nombre?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-ink truncate leading-tight">
                {user?.nombre || "Administrador"}
              </p>
              <p className="text-[11px] text-ink-secondary truncate leading-tight">
                {user?.email || "admin@nexuspc.com"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Cerrar sesión"
            className="p-1.5 text-ink-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors shrink-0"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Toggle Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-30 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm">
            N
          </div>
          <span className="font-extrabold text-base text-ink">
            Nexus<span className="text-primary">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl border border-border text-ink hover:bg-surface-alt transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-ink/50 backdrop-blur-xs z-40"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>
    </>
  );
}

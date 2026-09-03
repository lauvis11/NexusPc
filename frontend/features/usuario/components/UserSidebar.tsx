"use client";

import Link from "next/link";
import { User, Package, Shield, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/features/auth/context/auth-context";

export type UserSidebarTab = "mis-datos" | "mis-compras" | "cambiar-contraseña";

interface UserSidebarProps {
  activeTab?: UserSidebarTab;
  onTabChange?: (tab: UserSidebarTab | "logout") => void;
}

export function UserSidebar({ activeTab = "mis-datos", onTabChange }: UserSidebarProps) {
  const { user, logout } = useAuth();

  const menuItems: Array<{
    id: UserSidebarTab;
    label: string;
    href: string;
    icon: typeof User;
  }> = [
    {
      id: "mis-datos",
      label: "Mis Datos",
      href: "/perfil",
      icon: User,
    },
    {
      id: "mis-compras",
      label: "Mis Compras",
      href: "/perfil/compras",
      icon: Package,
    },
    {
      id: "cambiar-contraseña",
      label: "Cambiar contraseña",
      href: "/perfil/cambiar-contraseña",
      icon: Shield,
    },
  ];

  const handleLogout = async () => {
    onTabChange?.("logout");
    await logout();
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs space-y-6">
        {/* Header del Sidebar */}
        <div className="px-2">
          <h2 className="text-xl font-extrabold text-ink tracking-tight">Mi Cuenta</h2>
          <p className="text-xs text-ink-secondary mt-0.5 font-medium">
            Gestión de perfil y pedidos
          </p>
        </div>

        {/* Lista de Opciones */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange?.(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-primary text-surface shadow-sm"
                    : "text-ink-secondary hover:bg-surface-alt hover:text-ink"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-surface" : "text-primary"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {user?.rol === "ADMIN" && (
            <div className="pt-2 border-t border-border/60">
              <Link
                href="/admin"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-primary-tint/40 hover:bg-primary-tint/70 text-primary transition-all text-left"
              >
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <span>Panel de Administración</span>
              </Link>
            </div>
          )}

          {/* Botón de Cerrar Sesión Real */}
          <div className="pt-2 border-t border-border/60">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-500/10 transition-all text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/auth-context";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login?redirect=/admin");
      } else if (user.rol !== "ADMIN") {
        router.replace("/");
      }
    }
  }, [user, isLoading, router]);

  // Spinner mientras verifica sesión o si no es admin
  if (isLoading || !user || user.rol !== "ADMIN") {
    return (
      <div className="min-h-screen bg-surface-alt flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-ink-secondary">
            Verificando permisos de administrador...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 min-w-0 pt-16 lg:pt-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}

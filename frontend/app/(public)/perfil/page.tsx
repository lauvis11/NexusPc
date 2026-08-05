"use client";

import { useState } from "react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { UserSidebar } from "@/features/auth/components/UserSidebar";
import { MisDatosForm } from "@/features/auth/components/MisDatosForm";
import { Package, ShieldCheck } from "lucide-react";

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<
    "mis-datos" | "mis-compras" | "cambiar-contraseña"
  >("mis-datos");

  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary">
      <Header />
      <div className="pt-16 sm:pt-[112px]" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Modular de Usuario */}
          <UserSidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (tab !== "logout") {
                setActiveTab(tab as any);
              }
            }}
          />

          {/* Canvas Contenido Principal */}
          <div className="flex-1 w-full bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-xs">
            {activeTab === "mis-datos" && <MisDatosForm />}

            {activeTab === "mis-compras" && (
              <div className="space-y-6">
                <div className="pb-6 border-b border-border/50">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                    Mis Compras
                  </h1>
                  <p className="text-sm text-ink-secondary mt-1">
                    Historial y seguimiento de tus pedidos realizados
                  </p>
                </div>

                <div className="p-8 text-center space-y-3 bg-surface-alt/50 rounded-2xl border border-dashed border-border">
                  <Package className="w-10 h-10 text-primary mx-auto" />
                  <p className="font-extrabold text-ink text-base">Aún no tienes compras realizadas</p>
                  <p className="text-xs text-ink-secondary max-w-sm mx-auto">
                    Cuando realices tu primer pedido, podrás seguir su estado de envío y factura desde aquí.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "cambiar-contraseña" && (
              <div className="space-y-6">
                <div className="pb-6 border-b border-border/50">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                    Cambiar Contraseña
                  </h1>
                  <p className="text-sm text-ink-secondary mt-1">
                    Actualiza tu contraseña de acceso
                  </p>
                </div>

                <div className="p-8 text-center space-y-3 bg-surface-alt/50 rounded-2xl border border-dashed border-border">
                  <ShieldCheck className="w-10 h-10 text-primary mx-auto" />
                  <p className="font-extrabold text-ink text-base">Cambio de Contraseña</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { UserSidebar } from "@/features/usuario/components/UserSidebar";
import { MisDatosForm } from "@/features/usuario/components/MisDatosForm";
import { MisCompras } from "@/features/usuario/components/MisCompras";
import { CambiarPasswordForm } from "@/features/usuario/components/CambiarPasswordForm";

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
            {activeTab === "mis-compras" && <MisCompras />}
            {activeTab === "cambiar-contraseña" && <CambiarPasswordForm />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { UserSidebar } from "@/features/auth/components/UserSidebar";
import { User, Mail, Phone, Save, Package, ShieldCheck, MapPin } from "lucide-react";

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<
    "mis-datos" | "mis-compras" | "direcciones" | "seguridad" | "favoritos"
  >("mis-datos");

  const [formData, setFormData] = useState({
    nombre: "Julián",
    apellido: "Velásquez",
    email: "julian.v@techcore.com",
    telefono: "+54 9 11 4000-8800",
  });

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

          {/* Canvas Contenido Principal (Mockup) */}
          <div className="flex-1 w-full bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-xs">
            {activeTab === "mis-datos" && (
              <div className="space-y-6">
                <div className="pb-6 border-b border-border/50">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                    Información Personal
                  </h1>
                  <p className="text-sm text-ink-secondary mt-1">
                    Actualiza tus datos personales y datos de contacto
                  </p>
                </div>

                <form className="grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                  {/* Nombre */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-ink">
                      Nombre
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Apellido */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-ink">
                      Apellido
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
                      <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-ink">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-ink">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Guardar Cambios */}
                  <div className="sm:col-span-2 pt-4 flex justify-end gap-3 border-t border-border/50">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-primary text-surface font-extrabold px-6 py-3 rounded-xl hover:bg-primary-hover transition-all shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

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

            {activeTab === "direcciones" && (
              <div className="space-y-6">
                <div className="pb-6 border-b border-border/50">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                    Direcciones
                  </h1>
                  <p className="text-sm text-ink-secondary mt-1">
                    Gestiona tus direcciones de envío y facturación
                  </p>
                </div>

                <div className="p-8 text-center space-y-3 bg-surface-alt/50 rounded-2xl border border-dashed border-border">
                  <MapPin className="w-10 h-10 text-primary mx-auto" />
                  <p className="font-extrabold text-ink text-base">No hay direcciones guardadas</p>
                </div>
              </div>
            )}

            {activeTab === "seguridad" && (
              <div className="space-y-6">
                <div className="pb-6 border-b border-border/50">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                    Seguridad
                  </h1>
                  <p className="text-sm text-ink-secondary mt-1">
                    Cambio de contraseña y opciones de acceso
                  </p>
                </div>

                <div className="p-8 text-center space-y-3 bg-surface-alt/50 rounded-2xl border border-dashed border-border">
                  <ShieldCheck className="w-10 h-10 text-primary mx-auto" />
                  <p className="font-extrabold text-ink text-base">Seguridad de la Cuenta</p>
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

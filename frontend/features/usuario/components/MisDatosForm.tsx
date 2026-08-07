"use client";

import { useState, useEffect } from "react";
import { User, Mail, IdCard, MapPin, Building, Home, Hash, Save, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/context/auth-context";
import { crearDatosFacturacion, actualizarDatos } from "@/features/usuario/api/usuarios";

const PROVINCIAS_ARGENTINA = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires (CABA)",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

export function MisDatosForm() {
  const { user, isLoading, refreshUser } = useAuth();

  // Indica si ya tiene datos de facturación creados
  const tieneDatosFacturacion = user?.nombre_completo !== null && user?.nombre_completo !== undefined;

  // Estado de inputs editables y DNI
  const [editableData, setEditableData] = useState({
    nombreCompleto: "",
    dni: "",
    provincia: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sincronizar datos de usuario al cargar o actualizar
  useEffect(() => {
    if (user) {
      setEditableData({
        nombreCompleto: user.nombre_completo ?? "",
        dni: user.dni ?? "",
        provincia: user.provincia ?? "",
        direccion: user.direccion ?? "",
        ciudad: user.ciudad ?? "",
        codigoPostal: user.codigo_postal ?? "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSavedSuccess(false);

    try {
      if (!tieneDatosFacturacion) {
        // Primera vez: crear datos de facturación incluyendo el DNI
        await crearDatosFacturacion({
          nombre_completo: editableData.nombreCompleto,
          dni: editableData.dni,
          direccion: editableData.direccion,
          ciudad: editableData.ciudad,
          provincia: editableData.provincia,
          codigo_postal: editableData.codigoPostal,
        });
      } else {
        // Ya existen datos: actualizar sin modificar DNI
        await actualizarDatos({
          nombre_completo: editableData.nombreCompleto,
          direccion: editableData.direccion,
          ciudad: editableData.ciudad,
          provincia: editableData.provincia,
          codigo_postal: editableData.codigoPostal,
        });
      }

      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado al guardar los datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skeleton de Carga
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="pb-6 border-b border-border/50 space-y-2">
          <div className="h-8 w-64 bg-border/40 rounded-xl" />
          <div className="h-4 w-96 max-w-full bg-border/30 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-border/40 rounded-md" />
            <div className="h-11 w-full bg-border/30 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 bg-border/40 rounded-md" />
            <div className="h-11 w-full bg-border/30 rounded-xl" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="h-4 w-24 bg-border/40 rounded-md" />
            <div className="h-11 w-full bg-border/30 rounded-xl" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="h-4 w-32 bg-border/40 rounded-md" />
            <div className="h-11 w-full bg-border/30 rounded-xl" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="h-4 w-20 bg-border/40 rounded-md" />
            <div className="h-11 w-full bg-border/30 rounded-xl" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="h-4 w-20 bg-border/40 rounded-md" />
            <div className="h-11 w-full bg-border/30 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 bg-border/40 rounded-md" />
            <div className="h-11 w-full bg-border/30 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-border/40 rounded-md" />
            <div className="h-11 w-full bg-border/30 rounded-xl" />
          </div>
        </div>

        <div className="pt-4 flex justify-end border-t border-border/50">
          <div className="h-12 w-44 bg-border/40 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título de la Sección */}
      <div className="pb-6 border-b border-border/50">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Mis Datos Personales
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          Información de tu cuenta y datos de envío de pedidos
        </p>
      </div>

      {/* Alerta de Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Alerta de Éxito */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-sm font-bold animate-fade-in flex items-center gap-2">
          <span>✓ ¡Datos guardados correctamente!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── BLOQUE DE INPUTS ──────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Nombre (Bloqueado Siempre) */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-ink">
              Nombre
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary/60" />
              <input
                type="text"
                value={user?.nombre ?? ""}
                disabled
                readOnly
                placeholder="Nombre del usuario"
                className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-border/70 rounded-xl text-sm font-medium text-ink-secondary cursor-not-allowed select-none opacity-75"
              />
            </div>
          </div>

          {/* 2. DNI / Documento (Permitido solo si user.nombre_completo es null) */}
          <div className="space-y-1.5">
            <label htmlFor="dniInput" className="block text-xs sm:text-sm font-bold text-ink">
              DNI / Documento
            </label>
            <div className="relative">
              <IdCard className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${tieneDatosFacturacion ? "text-ink-secondary/60" : "text-ink-secondary"}`} />
              <input
                id="dniInput"
                type="text"
                value={editableData.dni}
                onChange={(e) => setEditableData({ ...editableData, dni: e.target.value })}
                disabled={tieneDatosFacturacion}
                readOnly={tieneDatosFacturacion}
                placeholder="Ingresa tu DNI"
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${
                  tieneDatosFacturacion
                    ? "bg-surface-alt border border-border/70 font-medium text-ink-secondary cursor-not-allowed select-none opacity-75"
                    : "bg-surface border border-border font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                }`}
              />
            </div>
          </div>

          {/* 3. Gmail (Bloqueado Siempre - Ancho Completo) */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs sm:text-sm font-bold text-ink">
              Gmail / Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary/60" />
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                readOnly
                placeholder="email@ejemplo.com"
                className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-border/70 rounded-xl text-sm font-medium text-ink-secondary cursor-not-allowed select-none opacity-75"
              />
            </div>
          </div>

          {/* 4. Nombre Completo */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="nombreCompleto" className="block text-xs sm:text-sm font-bold text-ink">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="nombreCompleto"
                type="text"
                value={editableData.nombreCompleto}
                onChange={(e) => setEditableData({ ...editableData, nombreCompleto: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Tu nombre y apellido completo"
              />
            </div>
          </div>

          {/* 5. Provincia */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="provincia" className="block text-xs sm:text-sm font-bold text-ink">
              Provincia
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <select
                id="provincia"
                value={editableData.provincia}
                onChange={(e) => setEditableData({ ...editableData, provincia: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
              >
                <option value="">Selecciona tu provincia</option>
                {PROVINCIAS_ARGENTINA.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Dirección */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="direccion" className="block text-xs sm:text-sm font-bold text-ink">
              Dirección
            </label>
            <div className="relative">
              <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="direccion"
                type="text"
                value={editableData.direccion}
                onChange={(e) => setEditableData({ ...editableData, direccion: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Ej: Av. Corrientes 1234, Piso 4 B"
              />
            </div>
          </div>

          {/* 7. Ciudad */}
          <div className="space-y-1.5">
            <label htmlFor="ciudad" className="block text-xs sm:text-sm font-bold text-ink">
              Ciudad
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="ciudad"
                type="text"
                value={editableData.ciudad}
                onChange={(e) => setEditableData({ ...editableData, ciudad: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Tu ciudad"
              />
            </div>
          </div>

          {/* 8. Código Postal */}
          <div className="space-y-1.5">
            <label htmlFor="codigoPostal" className="block text-xs sm:text-sm font-bold text-ink">
              Código Postal
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="codigoPostal"
                type="text"
                value={editableData.codigoPostal}
                onChange={(e) => setEditableData({ ...editableData, codigoPostal: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Ej: C1043"
              />
            </div>
          </div>
        </div>

        {/* Botón Guardar Cambios */}
        <div className="pt-4 flex justify-end border-t border-border/50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover active:scale-[0.98] text-surface font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

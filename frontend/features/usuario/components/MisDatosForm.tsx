"use client";

import { useState, useEffect } from "react";
import { User, Mail, IdCard, MapPin, Building, Home, Hash, Save, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/context/auth-context";
import { crearDatosFacturacion, actualizarDatos } from "@/features/usuario/api/usuarios";
import { datosFacturacionSchema, actualizarDatosFacturacionSchema } from "@/features/usuario/schemas/facturacion.schema";
import { PROVINCIAS_ARGENTINA } from "@/shared/constants/provincias";

export function MisDatosForm() {
  const { user, isLoading, refreshUser } = useAuth();

  // Indica si ya tiene datos de facturación creados
  const tieneDatosFacturacion = user?.nombre_completo !== null && user?.nombre_completo !== undefined;

  // Estado de inputs editables
  const [editableData, setEditableData] = useState({
    nombreCompleto: "",
    dni: "",
    provincia: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
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

  const handleChange = (field: string, value: string) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setSavedSuccess(false);

    // Validar con esquema Zod
    const rawPayload = {
      nombre_completo: editableData.nombreCompleto,
      dni: editableData.dni,
      provincia: editableData.provincia,
      direccion: editableData.direccion,
      ciudad: editableData.ciudad,
      codigo_postal: editableData.codigoPostal,
    };

    if (!tieneDatosFacturacion) {
      const validationResult = datosFacturacionSchema.safeParse(rawPayload);
      if (!validationResult.success) {
        const fieldMap: Record<string, string> = {
          nombre_completo: "nombreCompleto",
          dni: "dni",
          provincia: "provincia",
          direccion: "direccion",
          ciudad: "ciudad",
          codigo_postal: "codigoPostal",
        };
        const errors: Record<string, boolean> = {};
        validationResult.error.issues.forEach((issue) => {
          const fieldKey = fieldMap[issue.path[0] as string];
          if (fieldKey) errors[fieldKey] = true;
        });
        setFieldErrors(errors);
        const firstErrorMessage = validationResult.error.issues[0]?.message;
        setError(firstErrorMessage || "Por favor completa todos los campos obligatorios.");
        return;
      }

      setFieldErrors({});
      setIsSubmitting(true);

      try {
        await crearDatosFacturacion(validationResult.data);
        await refreshUser();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar los datos";
        setError(msg);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const validationResult = actualizarDatosFacturacionSchema.safeParse(rawPayload);
      if (!validationResult.success) {
        const fieldMap: Record<string, string> = {
          nombre_completo: "nombreCompleto",
          provincia: "provincia",
          direccion: "direccion",
          ciudad: "ciudad",
          codigo_postal: "codigoPostal",
        };
        const errors: Record<string, boolean> = {};
        validationResult.error.issues.forEach((issue) => {
          const fieldKey = fieldMap[issue.path[0] as string];
          if (fieldKey) errors[fieldKey] = true;
        });
        setFieldErrors(errors);
        const firstErrorMessage = validationResult.error.issues[0]?.message;
        setError(firstErrorMessage || "Por favor completa todos los campos obligatorios.");
        return;
      }

      setFieldErrors({});
      setIsSubmitting(true);

      try {
        await actualizarDatos(validationResult.data);
        await refreshUser();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar los datos";
        setError(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getInputStyle = (fieldName: string, isDisabled: boolean = false) => {
    if (isDisabled) {
      return "bg-surface-alt border border-border/70 font-medium text-ink-secondary cursor-not-allowed select-none opacity-75";
    }
    if (fieldErrors[fieldName]) {
      return "bg-red-500/5 border-2 border-red-500 text-ink font-semibold focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none";
    }
    return "bg-surface border border-border font-semibold text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none";
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

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${getInputStyle("nombre", true)}`}
              />
            </div>
          </div>

          {/* 2. DNI / Documento */}
          <div className="space-y-1.5">
            <label htmlFor="dniInput" className="block text-xs sm:text-sm font-bold text-ink">
              DNI / Documento {!tieneDatosFacturacion && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <IdCard className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${tieneDatosFacturacion ? "text-ink-secondary/60" : fieldErrors.dni ? "text-red-500" : "text-ink-secondary"}`} />
              <input
                id="dniInput"
                type="text"
                value={editableData.dni}
                onChange={(e) => handleChange("dni", e.target.value)}
                disabled={tieneDatosFacturacion}
                readOnly={tieneDatosFacturacion}
                required={!tieneDatosFacturacion}
                placeholder="Ingresa tu DNI"
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${getInputStyle("dni", tieneDatosFacturacion)}`}
              />
            </div>
          </div>

          {/* 3. Gmail (Bloqueado Siempre) */}
          <div className="space-y-1.5">
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
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs sm:text-sm transition-all ${getInputStyle("email", true)}`}
              />
            </div>
          </div>

          {/* 4. Nombre Completo */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="nombreCompleto" className="block text-xs sm:text-sm font-bold text-ink">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.nombreCompleto ? "text-red-500" : "text-ink-secondary"}`} />
              <input
                id="nombreCompleto"
                type="text"
                required
                value={editableData.nombreCompleto}
                onChange={(e) => handleChange("nombreCompleto", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${getInputStyle("nombreCompleto")}`}
                placeholder="Tu nombre y apellido completo"
              />
            </div>
          </div>

          {/* 5. Provincia */}
          <div className="space-y-1.5">
            <label htmlFor="provincia" className="block text-xs sm:text-sm font-bold text-ink">
              Provincia <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.provincia ? "text-red-500" : "text-ink-secondary"}`} />
              <select
                id="provincia"
                required
                value={editableData.provincia}
                onChange={(e) => handleChange("provincia", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${getInputStyle("provincia")}`}
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
          <div className="space-y-1.5">
            <label htmlFor="direccion" className="block text-xs sm:text-sm font-bold text-ink">
              Dirección <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Home className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.direccion ? "text-red-500" : "text-ink-secondary"}`} />
              <input
                id="direccion"
                type="text"
                required
                value={editableData.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${getInputStyle("direccion")}`}
                placeholder="Ej: Av. Corrientes 1234, Piso 4 B"
              />
            </div>
          </div>

          {/* 7. Ciudad */}
          <div className="space-y-1.5">
            <label htmlFor="ciudad" className="block text-xs sm:text-sm font-bold text-ink">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.ciudad ? "text-red-500" : "text-ink-secondary"}`} />
              <input
                id="ciudad"
                type="text"
                required
                value={editableData.ciudad}
                onChange={(e) => handleChange("ciudad", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${getInputStyle("ciudad")}`}
                placeholder="Tu ciudad"
              />
            </div>
          </div>

          {/* 8. Código Postal */}
          <div className="space-y-1.5">
            <label htmlFor="codigoPostal" className="block text-xs sm:text-sm font-bold text-ink">
              Código Postal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${fieldErrors.codigoPostal ? "text-red-500" : "text-ink-secondary"}`} />
              <input
                id="codigoPostal"
                type="text"
                required
                value={editableData.codigoPostal}
                onChange={(e) => handleChange("codigoPostal", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${getInputStyle("codigoPostal")}`}
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

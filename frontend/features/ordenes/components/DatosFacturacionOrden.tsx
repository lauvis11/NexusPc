"use client";

import { User, FileText, MapPin, Building, Globe, Mailbox, CheckCircle2, AlertCircle } from "lucide-react";
import { DatosFacturacion } from "@/features/usuario/types/usuarios";
import type { DatosFacturacionOrdenProps } from "../types/ordenes";
import { PROVINCIAS_ARGENTINA } from "@/shared/constants/provincias";

export function DatosFacturacionOrden({
  formData,
  onChange,
  fieldErrors = {},
  tieneDatosFacturacion = false,
  guardarEnPerfil = true,
  onToggleGuardarEnPerfil,
}: DatosFacturacionOrdenProps) {
  const getInputClass = (fieldName: keyof DatosFacturacion) => {
    const base = "w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all outline-none";
    if (fieldErrors[fieldName]) {
      return `${base} bg-red-500/5 border-2 border-red-500 text-ink focus:border-red-500 focus:ring-2 focus:ring-red-500/20`;
    }
    return `${base} bg-surface-alt/50 border border-border text-ink focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20`;
  };

  return (
    <section className="bg-surface border border-border rounded-2xl p-5 sm:p-7 space-y-6 shadow-2xs">
      {/* ── HEADER DEL PASO 1 ───────────────────────────────────── */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-border/60">
        <div className="w-8 h-8 rounded-xl bg-primary text-surface font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
          1
        </div>
        <div className="space-y-0.5">
          <h2 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight">
            Datos de Facturación y Entrega
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary">
            Completá o confirmá la información para la emisión de la factura y el envío de tus productos.
          </p>
        </div>
      </div>

      {/* ── BANNER INFORMATIVO / ESTADO ─────────────────────────── */}
      {tieneDatosFacturacion ? (
        <div className="flex items-center gap-2.5 p-3 sm:p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs text-ink">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Datos precargados automáticamente desde tu perfil. Podés modificarlos si lo necesitás para esta entrega.
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 p-3 sm:p-3.5 bg-primary-tint/50 border border-primary/20 rounded-xl text-xs text-ink">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span>
            Ingresá tus datos para el envío a domicilio y la facturación electrónica de tu pedido.
          </span>
        </div>
      )}

      {/* ── FORMULARIO GRID DE INPUTS ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre Completo */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Nombre y Apellido <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <User className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${fieldErrors.nombre_completo ? "text-red-500" : "text-ink-secondary"}`} />
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={(e) => onChange("nombre_completo", e.target.value)}
              className={getInputClass("nombre_completo")}
            />
          </div>
        </div>

        {/* DNI / CUIT */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            DNI o CUIT <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <FileText className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${fieldErrors.dni ? "text-red-500" : "text-ink-secondary"}`} />
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={(e) => onChange("dni", e.target.value)}
              disabled={tieneDatosFacturacion}
              readOnly={tieneDatosFacturacion}
              className={`${getInputClass("dni")} ${tieneDatosFacturacion ? "bg-surface-alt cursor-not-allowed opacity-75 select-none" : ""}`}
            />
          </div>
        </div>

        {/* Provincia */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Provincia <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Globe className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${fieldErrors.provincia ? "text-red-500" : "text-ink-secondary"}`} />
            <select
              name="provincia"
              value={formData.provincia}
              onChange={(e) => onChange("provincia", e.target.value)}
              className={`${getInputClass("provincia")} cursor-pointer`}
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

        {/* Dirección de Entrega */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Dirección (Calle y Altura) <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <MapPin className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${fieldErrors.direccion ? "text-red-500" : "text-ink-secondary"}`} />
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={(e) => onChange("direccion", e.target.value)}
              className={getInputClass("direccion")}
            />
          </div>
        </div>

        {/* Ciudad */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Ciudad / Localidad <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Building className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${fieldErrors.ciudad ? "text-red-500" : "text-ink-secondary"}`} />
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={(e) => onChange("ciudad", e.target.value)}
              className={getInputClass("ciudad")}
            />
          </div>
        </div>

        {/* Código Postal */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Código Postal <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Mailbox className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${fieldErrors.codigo_postal ? "text-red-500" : "text-ink-secondary"}`} />
            <input
              type="text"
              name="codigo_postal"
              value={formData.codigo_postal}
              onChange={(e) => onChange("codigo_postal", e.target.value)}
              className={getInputClass("codigo_postal")}
            />
          </div>
        </div>
      </div>

      {/* Checkbox guardar datos */}
      {onToggleGuardarEnPerfil && (
        <div className="pt-2">
          <label className="flex items-center gap-2.5 text-xs sm:text-sm text-ink-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={guardarEnPerfil}
              onChange={(e) => onToggleGuardarEnPerfil(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-border focus:ring-primary accent-primary cursor-pointer"
            />
            <span>Guardar o actualizar estos datos en mi perfil para futuras compras</span>
          </label>
        </div>
      )}
    </section>
  );
}

export default DatosFacturacionOrden;
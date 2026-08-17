import { User, FileText, MapPin, Building, Globe, Mailbox } from "lucide-react";

export function DatosFacturacionOrden() {
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

      {/* ── BANNER INFORMATIVO (MOCKUP) ─────────────────────────── */}
      <div className="flex items-center gap-2.5 p-3 sm:p-3.5 bg-primary-tint/50 border border-primary/20 rounded-xl text-xs text-ink">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <span>
          Tus datos se utilizarán para la entrega a domicilio y facturación electrónica.
        </span>
      </div>

      {/* ── FORMULARIO GRID DE INPUTS (MOCKUP) ──────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre Completo */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Nombre y Apellido <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="nombre_completo"
              placeholder="Ej: Juan Pérez"
              defaultValue="Juan Pérez"
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface-alt/50 border border-border rounded-xl text-xs sm:text-sm font-semibold text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:bg-surface focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* DNI / CUIT */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            DNI o CUIT <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="dni"
              placeholder="Ej: 38123456"
              defaultValue="38123456"
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface-alt/50 border border-border rounded-xl text-xs sm:text-sm font-semibold text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:bg-surface focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Dirección de Entrega (Full width) */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Dirección de Entrega (Calle, Número, Piso/Depto) <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="direccion"
              placeholder="Ej: Av. Corrientes 1234, Piso 4 B"
              defaultValue="Av. Corrientes 1234, Piso 4 B"
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface-alt/50 border border-border rounded-xl text-xs sm:text-sm font-semibold text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:bg-surface focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Ciudad */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Ciudad / Localidad <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="ciudad"
              placeholder="Ej: CABA"
              defaultValue="Ciudad Autónoma de Buenos Aires"
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface-alt/50 border border-border rounded-xl text-xs sm:text-sm font-semibold text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:bg-surface focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Provincia */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Provincia <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="provincia"
              placeholder="Ej: Buenos Aires"
              defaultValue="Buenos Aires"
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface-alt/50 border border-border rounded-xl text-xs sm:text-sm font-semibold text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:bg-surface focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Código Postal */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-bold text-ink uppercase tracking-wider block">
            Código Postal <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Mailbox className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="codigo_postal"
              placeholder="Ej: C1043"
              defaultValue="C1043"
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface-alt/50 border border-border rounded-xl text-xs sm:text-sm font-semibold text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:bg-surface focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Checkbox guardar datos */}
      <div className="pt-2">
        <label className="flex items-center gap-2.5 text-xs sm:text-sm text-ink-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 text-primary rounded border-border focus:ring-primary accent-primary cursor-pointer"
          />
          <span>Guardar o actualizar estos datos en mi perfil para futuras compras</span>
        </label>
      </div>
    </section>
  );
}

export default DatosFacturacionOrden;
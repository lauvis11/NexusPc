"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  AlertCircle,
  X,
  Edit3,
  MapPin,
  Check,
} from "lucide-react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { useCarritoStore } from "@/features/carrito/store/store";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/auth-context";
import { DatosFacturacion } from "@/features/usuario/types/usuarios";
import { datosFacturacionSchema, actualizarDatosFacturacionSchema } from "@/features/usuario/schemas/facturacion.schema";
import { crearDatosFacturacion, actualizarDatos } from "@/features/usuario/api/usuarios";
import { crearOrden, crearPreferenciaPago } from "@/features/ordenes/api/ordenes";
import { DatosFacturacionOrden } from "@/features/ordenes/components/DatosFacturacionOrden";
import { ResumenCheckout } from "@/features/ordenes/components/ResumenCheckout";
import { AvisoModoTestPago } from "@/features/ordenes/components/AvisoModoTestPago";
import { ModalAvisoTest } from "@/features/ordenes/components/ModalAvisoTest";
import { isValidMercadoPagoUrl } from "@/features/ordenes/utils/mercadoPago";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [paso, setPaso] = useState<1 | 2>(1);
  const [showModalAviso, setShowModalAviso] = useState(false);
  const [showModalVolver, setShowModalVolver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [guardarEnPerfil, setGuardarEnPerfil] = useState(true);

  const { user, isLoading, refreshUser } = useAuth();
  const { items, limpiarCarrito } = useCarritoStore();
  const router = useRouter();

  // Protección si no está autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, isLoading, router]);

  // Indica si el usuario ya tiene datos de facturación en la base de datos
  const tieneDatosFacturacion = Boolean(user?.nombre_completo && user?.direccion);

  // Estado del formulario de facturación
  const [formData, setFormData] = useState<DatosFacturacion>({
    nombre_completo: "",
    dni: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigo_postal: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof DatosFacturacion, boolean>>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Precargar datos del usuario cuando estén disponibles
  useEffect(() => {
    if (user) {
      setFormData({
        nombre_completo: user.nombre_completo ?? "",
        dni: user.dni ?? "",
        direccion: user.direccion ?? "",
        ciudad: user.ciudad ?? "",
        provincia: user.provincia ?? "",
        codigo_postal: user.codigo_postal ?? "",
      });
    }
  }, [user]);

  // Redirigir a /carrito solo después de que se cargue el store si el carrito sigue vacío
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/carrito");
    }
  }, [mounted, items, router]);

  const handleFieldChange = (field: keyof DatosFacturacion, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: false }));
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  /**
   * Valida el formulario de facturación/entrega según el estado del usuario
   */
  const validarFormulario = (): boolean => {
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("El carrito está vacío.");
      return false;
    }

    const schema = !tieneDatosFacturacion ? datosFacturacionSchema : actualizarDatosFacturacionSchema;
    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      const errors: Partial<Record<keyof DatosFacturacion, boolean>> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof DatosFacturacion;
        if (field) errors[field] = true;
      });
      setFieldErrors(errors);
      const firstErrorMessage = validationResult.error.issues[0]?.message;
      setErrorMessage(firstErrorMessage || "Por favor completá todos los campos obligatorios.");
      return false;
    }

    setFieldErrors({});
    return true;
  };

  /**
   * Al hacer clic en Siguiente en el Resumen:
   * Valida los datos y abre el Modal de aviso de modo test
   */
  const handleClicSiguiente = () => {
    if (validarFormulario()) {
      setShowModalAviso(true);
    }
  };

  /**
   * Al dar clic en Continuar en el Modal:
   * Cierra el modal y pasa al Paso 2 (mostrando las credenciales en lugar del formulario)
   */
  const handleContinuarDesdeModal = () => {
    setShowModalAviso(false);
    setPaso(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Procesa la compra final y redirige a Mercado Pago Sandbox
   */
  const handlePagar = async () => {
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("El carrito está vacío.");
      return;
    }

    if (!validarFormulario()) {
      setPaso(1);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!tieneDatosFacturacion) {
        const validationResult = datosFacturacionSchema.safeParse(formData);
        if (validationResult.success) {
          await crearDatosFacturacion(validationResult.data);
          await refreshUser();
        }
      } else if (guardarEnPerfil) {
        const validationResult = actualizarDatosFacturacionSchema.safeParse(formData);
        if (validationResult.success) {
          await actualizarDatos(validationResult.data);
          await refreshUser();
        }
      }

      // Crear la orden en el backend
      const orden = await crearOrden({
        productos: items.map((item) => ({
          id: item.id,
          cantidad: item.cantidad,
        })),
      });

      // Crear la preferencia de pago de Mercado Pago
      const pagoResponse = await crearPreferenciaPago(orden.id);

      // Validar que la URL de pago provenga de un dominio oficial de Mercado Pago
      if (pagoResponse?.init_point && isValidMercadoPagoUrl(pagoResponse.init_point)) {
        limpiarCarrito();
        window.location.href = pagoResponse.init_point;
      } else {
        throw new Error("El enlace de pago obtenido no es válido o seguro.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ocurrió un error al procesar el pago.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex flex-col selection:bg-primary-tint selection:text-primary relative">
      {/* Header Modular con Navbar */}
      <Header />
      <div className="pt-16 sm:pt-[112px]"></div>

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Título de la Página e Indicador de Pasos */}
        <div className="pb-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Finalizar Compra
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              {paso === 1
                ? "Completá tus datos de entrega y continuá al pago para confirmar tu orden."
                : "Revisá los datos de prueba autorizados y continuá a Mercado Pago."}
            </p>
          </div>

          {/* Stepper / Indicador de Progreso: Datos / Pago */}
          <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-center bg-surface border-2 border-border/80 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-xs">
            {/* Paso 1: Datos */}
            <button
              type="button"
              onClick={() => paso === 2 && setPaso(1)}
              className={`flex items-center gap-2.5 text-sm sm:text-base font-extrabold transition-all ${
                paso === 1
                  ? "text-primary cursor-default"
                  : "text-ink-secondary hover:text-ink cursor-pointer"
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shadow-xs transition-colors ${
                  paso === 1
                    ? "bg-primary text-surface"
                    : "bg-emerald-500 text-surface"
                }`}
              >
                {paso === 2 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span>Datos</span>
            </button>

            <span className="text-border font-bold text-base sm:text-lg">/</span>

            {/* Paso 2: Pago */}
            <div
              className={`flex items-center gap-2.5 text-sm sm:text-base font-bold transition-all ${
                paso === 2 ? "text-primary font-extrabold" : "text-ink-secondary opacity-60"
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-black transition-colors ${
                  paso === 2
                    ? "bg-primary text-surface"
                    : "bg-surface-alt border border-border text-ink-secondary"
                }`}
              >
                2
              </div>
              <span>Pago</span>
            </div>
          </div>
        </div>

        {/* Mensaje de Error General */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Layout en 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda (7 columnas) */}
          <div className="lg:col-span-7 space-y-6">
            {/* ── PASO 1: FORMULARIO DE DATOS ───────────────────────── */}
            {paso === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <DatosFacturacionOrden
                  formData={formData}
                  onChange={handleFieldChange}
                  fieldErrors={fieldErrors}
                  tieneDatosFacturacion={tieneDatosFacturacion}
                  guardarEnPerfil={guardarEnPerfil}
                  onToggleGuardarEnPerfil={setGuardarEnPerfil}
                />

                {/* Botón de Navegación: Volver al Carrito */}
                <div className="flex items-center justify-start pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModalVolver(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface hover:bg-surface-alt font-extrabold text-xs sm:text-sm text-ink hover:text-primary transition-all shadow-2xs hover:border-primary/40 active:scale-98 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver al carrito</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── PASO 2: CREDENCIALES EN LUGAR DEL FORMULARIO ──────── */}
            {paso === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Tarjeta de Modo Test con Credenciales y Tarjeta */}
                <AvisoModoTestPago />

                {/* Resumen compacto de entrega confirmada */}
                <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-ink">
                          Datos de Entrega Confirmados
                        </h3>
                        <p className="text-[11px] text-ink-secondary">
                          {formData.nombre_completo} • DNI {formData.dni}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPaso(1)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary-tint/50 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modificar datos</span>
                    </button>
                  </div>

                  <p className="text-xs text-ink-secondary">
                    <strong className="text-ink font-semibold">Dirección:</strong> {formData.direccion}, {formData.ciudad}, {formData.provincia} (CP: {formData.codigo_postal})
                  </p>
                </div>

                {/* Botón Volver a editar datos */}
                <div className="flex items-center justify-start pt-2">
                  <button
                    type="button"
                    onClick={() => setPaso(1)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface hover:bg-surface-alt font-extrabold text-xs sm:text-sm text-ink hover:text-primary transition-all shadow-2xs hover:border-primary/40 active:scale-98 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver a editar datos</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha: Resumen de Compra Sticky (se mantiene) */}
          <div className="lg:col-span-5">
            <ResumenCheckout
              onPagar={paso === 1 ? handleClicSiguiente : handlePagar}
              loading={isSubmitting}
              disabled={isSubmitting}
              textoBoton={paso === 1 ? "Siguiente" : "Pagar con Mercado Pago"}
              subtextoBoton={
                paso === 1
                  ? "Avanzarás al paso de pago simulado"
                  : "Serás redirigido a la pasarela de Mercado Pago para finalizar la compra"
              }
            />
          </div>
        </div>
      </main>

      {/* ── MODAL EXCLUSIVO DE AVISO DE MODO TEST ─────────────────── */}
      <ModalAvisoTest
        isOpen={showModalAviso}
        onClose={() => setShowModalAviso(false)}
        onContinuar={handleContinuarDesdeModal}
      />

      {/* ── MODAL DE CONFIRMACIÓN PARA VOLVER AL CARRITO ─────────── */}
      {showModalVolver && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            className="bg-surface border border-border rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setShowModalVolver(false)}
              className="absolute top-4 right-4 text-ink-secondary hover:text-ink p-1 rounded-lg hover:bg-surface-alt transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ícono y Título */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-ink tracking-tight">
                  ¿Estás seguro que quieres volver al carrito?
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  Tus productos se mantendrán guardados, pero deberás revisar tus datos al volver a esta pantalla.
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/carrito")}
                className="order-2 sm:order-1 flex-1 py-3 px-5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-ink-secondary hover:text-ink font-bold text-xs sm:text-sm transition-all text-center cursor-pointer whitespace-nowrap"
              >
                Si, quiero volver
              </button>

              <button
                type="button"
                onClick={() => setShowModalVolver(false)}
                className="order-1 sm:order-2 flex-1 py-3 px-5 rounded-xl bg-primary hover:bg-primary-hover text-surface font-extrabold text-xs sm:text-sm shadow-md transition-all text-center cursor-pointer active:scale-98 whitespace-nowrap"
              >
                No, continuar la compra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
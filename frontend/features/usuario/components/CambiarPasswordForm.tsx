"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cambiarContraseña } from "../api/usuarios";

export function CambiarPasswordForm() {
  const [formData, setFormData] = useState({
    contraseña_actual: "",
    nueva_contraseña: "",
    confirmar_contraseña: "",
  });

  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.contraseña_actual) {
      return setError("Por favor ingresa tu contraseña actual");
    }

    if (!formData.nueva_contraseña) {
      return setError("Por favor ingresa la nueva contraseña");
    }

    if (formData.nueva_contraseña.length < 8) {
      return setError("La nueva contraseña debe tener al menos 8 caracteres");
    }

    if (!/[0-9]/.test(formData.nueva_contraseña)) {
      return setError("La nueva contraseña debe contener al menos un número");
    }

    if (formData.nueva_contraseña !== formData.confirmar_contraseña) {
      return setError("Las contraseñas nuevas no coinciden");
    }

    if (formData.nueva_contraseña === formData.contraseña_actual) {
      return setError("La nueva contraseña no puede ser igual a la actual");
    }

    setIsSubmitting(true);

    try {
      await cambiarContraseña({
        contraseña_actual: formData.contraseña_actual,
        nueva_contraseña: formData.nueva_contraseña,
      });

      setSuccess(true);
      setFormData({
        contraseña_actual: "",
        nueva_contraseña: "",
        confirmar_contraseña: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ocurrió un error al intentar cambiar la contraseña";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Título de la Sección */}
      <div className="pb-6 border-b border-border/50">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Cambiar Contraseña
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          Actualiza tu clave de acceso a la cuenta
        </p>
      </div>

      {/* Alerta de Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Alerta de Éxito */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Contraseña actualizada correctamente</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* 1. Contraseña Actual */}
        <div className="space-y-1.5 max-w-md">
          <label htmlFor="contraseña_actual" className="block text-xs sm:text-sm font-bold text-ink">
            Contraseña Actual
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
            <input
              id="contraseña_actual"
              type={showActual ? "text" : "password"}
              value={formData.contraseña_actual}
              onChange={(e) => setFormData({ ...formData, contraseña_actual: e.target.value })}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full pl-10 pr-11 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink placeholder:text-ink-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowActual(!showActual)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink cursor-pointer"
              aria-label="Alternar visibilidad"
            >
              {showActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Grid de Inputs para Nueva Contraseña (Uno al lado del otro) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 2. Nueva Contraseña */}
          <div className="space-y-1.5">
            <label htmlFor="nueva_contraseña" className="block text-xs sm:text-sm font-bold text-ink">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="nueva_contraseña"
                type={showNueva ? "text" : "password"}
                value={formData.nueva_contraseña}
                onChange={(e) => setFormData({ ...formData, nueva_contraseña: e.target.value })}
                placeholder="Mínimo 8 caracteres y 1 número"
                disabled={isSubmitting}
                className="w-full pl-10 pr-11 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink placeholder:text-ink-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowNueva(!showNueva)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink cursor-pointer"
                aria-label="Alternar visibilidad"
              >
                {showNueva ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. Reingrese la Nueva Contraseña */}
          <div className="space-y-1.5">
            <label htmlFor="confirmar_contraseña" className="block text-xs sm:text-sm font-bold text-ink">
              Reingrese la Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="confirmar_contraseña"
                type={showConfirmar ? "text" : "password"}
                value={formData.confirmar_contraseña}
                onChange={(e) => setFormData({ ...formData, confirmar_contraseña: e.target.value })}
                placeholder="Repite la nueva contraseña"
                disabled={isSubmitting}
                className="w-full pl-10 pr-11 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink placeholder:text-ink-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmar(!showConfirmar)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink cursor-pointer"
                aria-label="Alternar visibilidad"
              >
                {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Botón Cambiar Contraseña */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover active:scale-[0.98] text-surface font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Cambiar Contraseña</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CambiarPasswordForm;

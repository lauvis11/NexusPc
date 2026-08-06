"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound, AlertCircle } from "lucide-react";

export function CambiarPasswordForm() {
  const [formData, setFormData] = useState({
    nuevaPassword: "",
    confirmarPassword: "",
  });

  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.nuevaPassword) {
      return setError("Por favor ingresa tu nueva contraseña");
    }

    if (formData.nuevaPassword.length < 8) {
      return setError("La contraseña debe tener al menos 8 caracteres");
    }

    if (!/[0-9]/.test(formData.nuevaPassword)) {
      return setError("La contraseña debe contener al menos un número");
    }

    if (formData.nuevaPassword !== formData.confirmarPassword) {
      return setError("Las contraseñas no coinciden");
    }

    setSuccess(true);
    setFormData({ nuevaPassword: "", confirmarPassword: "" });
    setTimeout(() => setSuccess(false), 4000);
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
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Alerta de Éxito */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in">
          <span>✓ Contraseña actualizada correctamente</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Grid de Inputs (Uno al lado del otro) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Nueva Contraseña */}
          <div className="space-y-1.5">
            <label htmlFor="nuevaPassword" className="block text-xs sm:text-sm font-bold text-ink">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="nuevaPassword"
                type={showNueva ? "text" : "password"}
                value={formData.nuevaPassword}
                onChange={(e) => setFormData({ ...formData, nuevaPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink placeholder:text-ink-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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

          {/* 2. Reingrese la Nueva Contraseña */}
          <div className="space-y-1.5">
            <label htmlFor="confirmarPassword" className="block text-xs sm:text-sm font-bold text-ink">
              Reingrese la Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
              <input
                id="confirmarPassword"
                type={showConfirmar ? "text" : "password"}
                value={formData.confirmarPassword}
                onChange={(e) => setFormData({ ...formData, confirmarPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-surface border border-border rounded-xl text-sm font-semibold text-ink placeholder:text-ink-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover active:scale-[0.98] text-surface font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer text-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Cambiar Contraseña</span>
          </button>
        </div>
      </form>
    </div>
  );
}

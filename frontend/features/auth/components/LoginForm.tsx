"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (field: keyof LoginInput, value: string) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);

    // Validar en tiempo real con Zod
    const result = loginSchema.safeParse(nextData);
    if (!result.success) {
      const fieldError = result.error.issues.find((issue: any) => issue.path[0] === field);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError ? fieldError.message : undefined,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Partial<Record<keyof LoginInput, string>> = {};
      result.error.issues.forEach((issue: any) => {
        const fieldName = issue.path[0] as keyof LoginInput;
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulación de respuesta de API
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card Principal */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-xl border border-border relative overflow-hidden backdrop-blur-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Ingresa tus datos para acceder a tu cuenta
          </p>
        </div>

        {submitSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-sm font-bold flex items-center gap-2 animate-fade-in">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>¡Inicio de sesión exitoso! Redirigiendo...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Campo Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-ink">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-secondary" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="nombre@ejemplo.com"
                className={`w-full pl-11 pr-4 py-3 bg-surface border ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-border focus:border-primary focus:ring-primary"
                } rounded-xl text-sm text-ink placeholder:text-ink-secondary/50 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                <span>•</span> {errors.email}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-ink">
                Contraseña
              </label>
              <a
                href="#"
                className="text-xs font-bold text-primary hover:underline transition-all"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-secondary" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-11 pr-11 py-3 bg-surface border ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-border focus:border-primary focus:ring-primary"
                } rounded-xl text-sm text-ink placeholder:text-ink-secondary/50 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink transition-colors cursor-pointer"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                <span>•</span> {errors.password}
              </p>
            )}
          </div>

          {/* Botón Iniciar Sesión */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-surface font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Iniciando sesión...</span>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Card */}
        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="text-xs sm:text-sm text-ink-secondary font-medium">
            ¿No tienes cuenta?{" "}
            <Link
              href="/registro"
              className="text-primary font-extrabold hover:underline transition-all"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

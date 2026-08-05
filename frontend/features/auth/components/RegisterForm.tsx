"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import { register } from "../api/auth";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterInput>({
    nombre: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof RegisterInput, value: string) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);
    if (serverError) setServerError(null);

    // Validar en tiempo real con Zod
    const result = registerSchema.safeParse(nextData);
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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      return setErrors({
        nombre: result.error.issues.find((i: any) => i.path[0] === "nombre")?.message,
        email: result.error.issues.find((i: any) => i.path[0] === "email")?.message,
        password: result.error.issues.find((i: any) => i.path[0] === "password")?.message,
      });
    }

    setErrors({});
    setServerError(null);
    setIsSubmitting(true);

    try {
      await register(result.data);
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al registrarse";
      if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
        setServerError("Ocurrió un error inesperado en el servidor");
      } else {
        setServerError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card Principal */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-xl border border-border relative overflow-hidden backdrop-blur-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Crear una cuenta
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            Completa tus datos para registrarte
          </p>
        </div>

        {/* Mensaje de Error del Servidor */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm font-bold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Campo Nombre */}
          <div className="space-y-1.5">
            <label htmlFor="nombre" className="block text-xs sm:text-sm font-bold text-ink">
              Nombre
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-secondary" />
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Tu nombre completo"
                className={`w-full pl-11 pr-4 py-3 bg-surface border ${
                  errors.nombre ? "border-red-500 focus:ring-red-500" : "border-border focus:border-primary focus:ring-primary"
                } rounded-xl text-sm text-ink placeholder:text-ink-secondary/50 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
              />
            </div>
            {errors.nombre && (
              <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                <span>•</span> {errors.nombre}
              </p>
            )}
          </div>

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
            <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-ink">
              Contraseña
            </label>
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
            <p className="text-[11px] text-ink-secondary font-medium pt-0.5">
              Debe contener al menos 8 caracteres y 1 número.
            </p>
          </div>

          {/* Botón Crear Cuenta */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-surface font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Creando cuenta...</span>
            ) : (
              <>
                <span>Crear Cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Card */}
        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="text-xs sm:text-sm text-ink-secondary font-medium">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="text-primary font-extrabold hover:underline transition-all"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

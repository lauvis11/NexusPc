"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function Error404() {
  return (
    <main className="min-h-screen bg-surface-alt text-ink font-sans flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-lg mx-auto space-y-6">
        {/* Gigante 404 */}
        <h1 className="text-7xl sm:text-9xl font-black text-primary tracking-tighter leading-none select-none">
          404
        </h1>

        {/* Mensajes */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Página no encontrada.
          </h2>
          <p className="text-sm sm:text-base text-ink max-w-md mx-auto leading-relaxed">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Botones de navegación */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-surface font-extrabold text-sm sm:text-base rounded-xl px-6 py-3.5 hover:bg-primary-hover active:scale-98 transition-all shadow-md cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>

          <Link
            href="/productos"
            className="inline-flex items-center justify-center gap-2 bg-surface border border-border text-ink font-bold text-sm sm:text-base rounded-xl px-6 py-3.5 hover:border-primary hover:text-primary transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ver catálogo</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export { Error404 as Componente404, Error404 as NotFound404 };

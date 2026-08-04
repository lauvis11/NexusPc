"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductoCard } from "./ProductoCard";
import type { Producto } from "../types/types";

// Productos hardcodeados de NVIDIA
const PRODUCTOS_NVIDIA: Producto[] = [
  {
    id: "nvidia-1",
    nombre: "NVIDIA GeForce RTX 4080 Super 16GB",
    descripcion: "Arquitectura Ada Lovelace con DLSS 3.5 y rendimiento masivo en 4K.",
    precio: 1799000,
    precioOferta: 1549000,
    stock: 5,
    img_url: "https://lh3.googleusercontent.com/aida/AP1WRLso3VI_k7IKPgRBtOJZY3YZR_MUSfjsUJMo-T8YMkOp11HLhjV26CFP6-07ONXaWJgknmYiKTri5RXbMvj79ZtCcSMHJY4oiBYHtslSjIo81AeAm8zPGn-hRxJuqwx-6n88rV-Jw0zN-Uan2A6GwZTjlm4oXaVxAOKfeCGLrJ0Fv-XGIwqNiSzWtfN7NoVIPs9zvJ8JCfkfvBBdzi1i1Xowzml-69xUq1XfhQOYuuC0atyvpEO_Nz46WqU",
    public_id: "rtx-4080-super",
    created_at: new Date().toISOString(),
    categoria: "Tarjetas Gráficas",
    subcategoria: "NVIDIA",
    subcategoria_id: 1,
    caracteristicas: [{ clave: "VRAM", valor: "16GB GDDR6X" }],
  },
  {
    id: "nvidia-2",
    nombre: "NVIDIA GeForce RTX 4060 Ti 8GB OC",
    descripcion: "Framerates ultra altos en 1080p y 1440p con trazado de rayos de 3ª generación.",
    precio: 689000,
    precioOferta: 599000,
    stock: 9,
    img_url: "https://lh3.googleusercontent.com/aida/AP1WRLsaEkeyXelf8RhLVH8XKr7cOUNjF5c1fkE-rN2ot28pAN_wac3aZr4OgrZUK_Any9yMbJE1y-z8t7Ke9wxODOo6WDOx4eP7OxNin4cJZkB1AVLe9bBC1acLhS66HDCgz-15VrOdnJuQWL9El5iXfdfyyXgu8XFMFShmegM6oeOyn3AQniQJnPSb0inVYLeKSnUujgLX2EqoVk5XLVOhotDjONlmfypPCd0lBJjb9ZEovX3oaDl3frXJYRc",
    public_id: "rtx-4060-ti",
    created_at: new Date().toISOString(),
    categoria: "Tarjetas Gráficas",
    subcategoria: "NVIDIA",
    subcategoria_id: 1,
    caracteristicas: [{ clave: "VRAM", valor: "8GB GDDR6" }],
  },
];

interface SeccionNvidiaProps {
  onAddToCart?: (producto: Producto) => void;
}

export function SeccionNvidia({ onAddToCart }: SeccionNvidiaProps) {
  return (
    <section className="w-full py-8 sm:py-12">
      {/* Contenedor ancho 100% de la pantalla con más altura */}
      <div className="relative w-full min-h-[480px] sm:min-h-[560px] lg:min-h-[620px] overflow-hidden border-y border-border/60 shadow-2xl bg-slate-950 flex items-center">
        {/* Imagen de fondo full-bleed */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/banners/hero1.png')" }}
        ></div>

        {/* Capa de gradiente oscura para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40"></div>
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Contenido Grid dentro de container centrado */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Marca / Texto explicativo */}
          <div className="lg:col-span-5 text-surface space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Descubrí lo mejor de <span className="text-emerald-400">NVIDIA</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-md">
              Arquitectura Ada Lovelace para una eficiencia sin precedentes en IA, Ray Tracing realista y DLSS 3.5.
            </p>

            <div>
              <Link
                href="/productos?categoria=placas-de-video"
                className="inline-flex items-center gap-2.5 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/25"
              >
                <span>Ver Colección GeForce</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Grilla de productos (2 por fila en mobile y desktop) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-6">
            {PRODUCTOS_NVIDIA.map((prod) => (
              <ProductoCard
                key={prod.id}
                producto={prod}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default SeccionNvidia;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, AlertCircle, RotateCcw } from "lucide-react";
import { ProductoCard } from "./ProductoCard";
import type { Producto } from "../types/types";
import { getProductos } from "../api/productos";
import { API_URL } from "@/lib/constants";

export function SeccionNvidia() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNvidia = async () => {
    setLoading(true);
    setError(false);
    try {
      // 1. Intentar buscar por RTX / GeForce con getProductos de la API
      let data = await getProductos(`${API_URL}/productos?busqueda=RTX&limit=2`, 60);

      // 2. Si no hay resultados, buscar por categoría Placas de Video
      if (!data.data || data.data.length === 0) {
        data = await getProductos(`${API_URL}/productos?categoria=Placas+de+Video&limit=2`, 60);
      }

      // 3. Si aún no hay, buscar por NVIDIA
      if (!data.data || data.data.length === 0) {
        data = await getProductos(`${API_URL}/productos?busqueda=NVIDIA&limit=2`, 60);
      }

      setProductos(data.data?.slice(0, 2) ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNvidia();
  }, []);

  if (!loading && !error && productos.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 sm:py-12">
      {/* Contenedor ancho 100% de la pantalla */}
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
              Arquitectura Ada Lovelace para una eficiencia sin precedentes en IA, Ray Tracing ultra realista y DLSS 3.5.
            </p>

            <div>
              <Link
                href="/productos?categoria=Placas+de+Video"
                className="inline-flex items-center gap-2.5 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/25"
              >
                <span>Ver Colección GeForce</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Grilla de productos (2 por fila) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-6">
            {loading ? (
              // Skeletons de carga
              Array.from({ length: 2 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-surface/90 backdrop-blur-md border border-border/80 p-3 sm:p-5 rounded-xl sm:rounded-2xl animate-pulse flex flex-col h-72 sm:h-96"
                >
                  <div className="h-36 sm:h-56 w-full bg-slate-200/80 rounded-lg sm:rounded-xl mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-slate-200/80 rounded" />
                    <div className="h-4 w-3/4 bg-slate-200/80 rounded" />
                  </div>
                  <div className="mt-auto pt-2 flex justify-between items-center">
                    <div className="space-y-1.5">
                      <div className="h-5 w-24 bg-slate-200/80 rounded" />
                      <div className="h-3 w-14 bg-slate-200/80 rounded" />
                    </div>
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-200/80 shrink-0" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-2 p-6 bg-surface/80 rounded-2xl border border-border text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                <p className="text-xs sm:text-sm font-bold text-ink">
                  No se pudieron cargar los productos de NVIDIA
                </p>
                <button
                  onClick={fetchNvidia}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-surface text-xs font-bold rounded-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reintentar</span>
                </button>
              </div>
            ) : (
              productos.map((prod) => (
                <ProductoCard
                  key={prod.id}
                  producto={prod}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

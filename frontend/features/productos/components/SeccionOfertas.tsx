"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, AlertCircle, RotateCcw } from "lucide-react";
import { ProductoCard } from "./ProductoCard";
import { SeccionSkeleton } from "./SeccionSkeleton";
import type { Producto } from "../types/types";
import { getProductos } from "../api/productos";
import { API_URL } from "@/lib/constants";

export function SeccionOfertas() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchOfertas = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await getProductos(
        `${API_URL}/productos?en_oferta=true&en_stock=true&limit=12`,
        60
      );
      setProductos(response.data ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertas();
  }, []);

  const handlePrev = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    if (el.scrollLeft <= 10) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Estado de Carga con SeccionSkeleton
  if (loading) {
    return (
      <SeccionSkeleton titulo="Productos en" subtituloHighlight="oferta" />
    );
  }

  // Error visual cuando falla la petición
  if (error) {
    return (
      <section className="w-full py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-ink tracking-tight">
              Productos en <span className="text-primary font-black">oferta</span>
            </h2>
          </div>
        </div>

        <div className="h-72 sm:h-96 w-full flex flex-col items-center justify-center p-6 text-center border border-border/80 bg-surface rounded-2xl shadow-xs relative overflow-hidden">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mb-3.5 shrink-0" />
          <h3 className="text-base sm:text-lg font-bold text-ink mb-4">
            No se pudieron cargar los productos
          </h3>
          <button
            onClick={fetchOfertas}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-primary text-surface font-bold text-xs sm:text-sm hover:bg-primary-hover active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      </section>
    );
  }

  // Si no hay productos en oferta, no renderizar la sección
  if (productos.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-black text-ink tracking-tight">
            Productos en <span className="text-primary font-black">oferta</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Anterior oferta"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Siguiente oferta"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Carrusel Deslizante Libre con soporte táctil nativo fluido y snap */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="w-[calc((100%-12px)/2.25)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3*1.5rem)/4)] shrink-0 snap-start"
          >
            <ProductoCard producto={producto} />
          </div>
        ))}
      </div>
    </section>
  );
}

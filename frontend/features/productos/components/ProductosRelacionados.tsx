"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, AlertCircle, RotateCcw } from "lucide-react";
import { ProductoCard } from "./ProductoCard";
import { SeccionSkeleton } from "./SeccionSkeleton";
import type { Producto } from "../types/types";
import { getProductos } from "../api/productos";
import { API_URL } from "@/lib/constants";

interface ProductosRelacionadosProps {
  categoria: string;
  productoIdActual?: string;
  productos?: Producto[];
}

export function ProductosRelacionados({
  categoria,
  productoIdActual,
  productos: propProductos,
}: ProductosRelacionadosProps) {
  const [productos, setProductos] = useState<Producto[]>(propProductos ?? []);
  const [loading, setLoading] = useState(!propProductos);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(4);
  const [gapPx, setGapPx] = useState(24);

  const touchStartX = useRef<number | null>(null);

  const fetchRelacionados = async () => {
    if (propProductos) return;
    setLoading(true);
    setError(false);
    try {
      const response = await getProductos(
        `${API_URL}/productos?categoria=${encodeURIComponent(categoria)}&en_stock=true&limit=12`,
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
    fetchRelacionados();
  }, [categoria]);

  // Filtrar productos por la misma categoría y excluir el producto actual
  const productosFiltrados = productos.filter((p) => {
    const mismaCategoria =
      !categoria || p.categoria.toLowerCase() === categoria.toLowerCase();
    const diferenteId = !productoIdActual || p.id !== productoIdActual;
    return mismaCategoria && diferenteId && p.stock > 0;
  });

  const totalItems = productosFiltrados.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsVisible(2.25); // 2 cards completas + 3ra asomada (< 50%)
        setGapPx(12);
      } else if (window.innerWidth < 1024) {
        setItemsVisible(2);
        setGapPx(24);
      } else {
        setItemsVisible(4);
        setGapPx(24);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, totalItems - Math.floor(itemsVisible));

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));

  // Touch handlers para swipe en mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 40) {
      handleNext();
    } else if (diffX < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Estado de Carga con SeccionSkeleton
  if (loading) {
    return (
      <SeccionSkeleton titulo="Productos" subtituloHighlight="relacionados" />
    );
  }

  // Error visual cuando falla la petición
  if (error) {
    return (
      <section className="w-full py-8 sm:py-12 border-t border-border/60 overflow-hidden">
        <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-ink tracking-tight">
              Productos{" "}
              <span className="text-primary font-black">relacionados</span>
            </h2>
          </div>
        </div>

        <div className="h-72 sm:h-96 w-full flex flex-col items-center justify-center p-6 text-center border border-border/80 bg-surface rounded-2xl shadow-xs relative overflow-hidden">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mb-3.5 shrink-0" />
          <h3 className="text-base sm:text-lg font-bold text-ink mb-4">
            No se pudieron cargar los productos
          </h3>
          <button
            onClick={fetchRelacionados}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-primary text-surface font-bold text-xs sm:text-sm hover:bg-primary-hover active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      </section>
    );
  }

  if (productosFiltrados.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-12 border-t border-border/60 overflow-hidden">
      {/* Header con título y controles del carrusel */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-black text-ink tracking-tight">
            Productos <span className="text-primary font-black">relacionados</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Anterior relacionado"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Siguiente relacionado"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Carrusel Deslizante */}
      <div
        className="relative py-2 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out gap-3 sm:gap-6"
          style={{
            transform: `translateX(calc(-${currentIndex} * (100% + ${gapPx}px) / ${itemsVisible}))`,
          }}
        >
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="w-[calc((100%-12px)/2.25)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3*1.5rem)/4)] shrink-0"
            >
              <ProductoCard producto={producto} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

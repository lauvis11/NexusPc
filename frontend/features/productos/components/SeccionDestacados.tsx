"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductoCard } from "./ProductoCard";
import type { Producto } from "../types/types";

interface SeccionDestacadosProps {
  onAddToCart?: (producto: Producto) => void;
}

export function SeccionDestacados({ onAddToCart }: SeccionDestacadosProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(4);
  const [gapPx, setGapPx] = useState(24);

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const res = await fetch(
          "/api/productos?destacado=true&en_stock=true&limit=12"
        );
        if (!res.ok) return;
        const json = await res.json();
        setProductos(json.data ?? []);
      } catch {
        // en caso de error simplemente no se muestra la sección
      } finally {
        setLoading(false);
      }
    };
    fetchDestacados();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsVisible(2.25); // 2 cards completas + 3ra asomada (<50%)
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

  const totalItems = productos.length;
  const maxIndex = Math.max(0, totalItems - Math.floor(itemsVisible));

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));

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

  // Skeleton placeholders durante la carga
  if (loading) {
    return (
      <section className="w-full py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
          <div className="h-8 w-56 bg-surface rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface animate-pulse" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface animate-pulse" />
          </div>
        </div>
        <div className="flex gap-3 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[calc((100%-12px)/2.25)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3*1.5rem)/4)] shrink-0 h-72 sm:h-96 bg-surface rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Si no hay productos destacados, no renderizar la sección
  if (productos.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header con Controles del Carrusel */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-black text-ink tracking-tight">
            Productos{" "}
            <span className="text-primary font-black">destacados</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Anterior slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Siguiente slide"
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
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="w-[calc((100%-12px)/2.25)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3*1.5rem)/4)] shrink-0"
            >
              <ProductoCard producto={producto} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SeccionDestacados;

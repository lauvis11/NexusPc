"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Cpu,
  Laptop,
  CircuitBoard,
  Zap,
  SlidersHorizontal,
  HardDrive,
  Keyboard,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Categorías disponibles
export interface Categoria {
  id: number;
  nombre: string;
}

const CATEGORIAS_API: Categoria[] = [
  { id: 4, nombre: "Placas de Video" },
  { id: 1, nombre: "Procesadores" },
  { id: 2, nombre: "Notebooks" },
  { id: 3, nombre: "Mothers" },
  { id: 5, nombre: "Memorias Ram" },
  { id: 6, nombre: "Almacenamiento" },
  { id: 7, nombre: "Perifericos" },
  { id: 8, nombre: "Sillas Gamers" },
];

// Mapeo de iconos para cada categoría por ID / Nombre
const getCategoriaIcon = (nombre: string) => {
  const norm = nombre.toLowerCase();
  if (norm.includes("procesador")) return Cpu;
  if (norm.includes("notebook")) return Laptop;
  if (norm.includes("mother")) return CircuitBoard;
  if (norm.includes("placa") || norm.includes("video")) return Zap;
  if (norm.includes("ram") || norm.includes("memoria")) return SlidersHorizontal;
  if (norm.includes("almacenamiento") || norm.includes("ssd")) return HardDrive;
  if (norm.includes("periferico")) return Keyboard;
  if (norm.includes("silla") || norm.includes("gamer")) return Gamepad2;
  return Cpu;
};

interface CategoriasProps {
  onSelectCategory?: (id: number | null) => void;
  selectedCategoryId?: number | null;
}

export function Categorias({ onSelectCategory, selectedCategoryId }: CategoriasProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const handlePrev = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const colWidth = el.firstElementChild?.clientWidth || 100;
    if (el.scrollLeft <= 10) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -colWidth - 16, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const colWidth = el.firstElementChild?.clientWidth || 100;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: colWidth + 16, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    const progress = el.scrollLeft / maxScroll;
    setActiveSlide(progress > 0.5 ? 1 : 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      if (Math.abs(e.touches[0].clientX - touchStartX.current) > 10) {
        isDragging.current = true;
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    setTimeout(() => {
      isDragging.current = false;
    }, 80);
  };

  const renderCategoriaCard = (cat: Categoria) => {
    const Icon = getCategoriaIcon(cat.nombre);
    const isSelected = selectedCategoryId === cat.id;
    const href = `/productos?categoria=${encodeURIComponent(cat.nombre)}`;

    return (
      <Link
        key={cat.id}
        href={href}
        onClick={(e) => {
          if (isDragging.current) {
            e.preventDefault();
            return;
          }
          if (onSelectCategory) {
            onSelectCategory(cat.id);
          }
        }}
        className="flex flex-col items-center justify-center p-1.5 sm:p-3 text-center transition-all group cursor-pointer w-full select-none"
        title={`Ver ${cat.nombre}`}
      >
        <div
          className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-1.5 sm:mb-3 shrink-0 transition-all duration-300 group-hover:scale-105 active:scale-95 ${
            isSelected
              ? "bg-primary text-surface shadow-md shadow-primary/30"
              : "bg-primary-tint text-primary group-hover:bg-primary group-hover:text-surface group-hover:shadow-md group-hover:shadow-primary/20"
          }`}
        >
          <Icon className="w-7 h-7 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <h3
          className={`font-extrabold text-xs sm:text-base lg:text-lg tracking-tight leading-snug transition-colors w-full text-center ${
            isSelected ? "text-primary font-black" : "text-ink group-hover:text-primary"
          }`}
        >
          {cat.nombre}
        </h3>
      </Link>
    );
  };

  const COLUMNAS = [
    [CATEGORIAS_API[0], CATEGORIAS_API[4]], // Col 0: Placas de Video, Memorias Ram
    [CATEGORIAS_API[1], CATEGORIAS_API[5]], // Col 1: Procesadores, Almacenamiento
    [CATEGORIAS_API[2], CATEGORIAS_API[6]], // Col 2: Notebooks, Perifericos
    [CATEGORIAS_API[3], CATEGORIAS_API[7]], // Col 3: Mothers, Sillas Gamers
  ];

  return (
    <section className="py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-hidden">
      <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-black text-ink tracking-tight">
            Explora nuestras <span className="text-primary font-black">categorías</span>
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

      {/* Carrusel Slider Libre con soporte táctil nativo fluido y snap */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-3 sm:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x"
        style={{ WebkitOverflowScrolling: "touch" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {COLUMNAS.map((col, idx) => (
          <div
            key={idx}
            className="w-[calc((100%-2*0.75rem)/3)] sm:w-[calc((100%-2*2rem)/3)] shrink-0 snap-start flex flex-col gap-3 sm:gap-8 items-center"
          >
            {renderCategoriaCard(col[0])}
            {renderCategoriaCard(col[1])}
          </div>
        ))}
      </div>

      {/* Indicadores del Carrusel */}
      <div className="flex justify-center items-center gap-2 mt-4 sm:mt-6">
        {[0, 1].map((idx) => (
          <button
            key={idx}
            onClick={() => {
              const el = scrollContainerRef.current;
              if (!el) return;
              const maxScroll = el.scrollWidth - el.clientWidth;
              el.scrollTo({ left: idx * maxScroll, behavior: "smooth" });
            }}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeSlide === idx
                ? "w-6 sm:w-8 bg-primary"
                : "w-2 sm:w-2.5 bg-border hover:bg-ink-secondary"
            }`}
            aria-label={`Ir al slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

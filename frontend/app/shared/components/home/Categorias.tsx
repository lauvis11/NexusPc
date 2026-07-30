"use client";
import {
  Cpu,
  Laptop,
  CircuitBoard,
  Zap,
  SlidersHorizontal,
  HardDrive,
  Keyboard,
  Gamepad2,
  ChevronRight,
} from "lucide-react";

// Categorías recibidas de la API
export interface Categoria {
  id: number;
  nombre: string;
}

const CATEGORIAS_API: Categoria[] = [
  { id: 1, nombre: "Procesadores" },
  { id: 2, nombre: "Notebooks" },
  { id: 3, nombre: "Mothers" },
  { id: 4, nombre: "Placas de Video" },
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
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Categorías de Hardware
          </h2>
          <p className="text-ink-secondary text-sm mt-1">
            Explorá componentes de máxima calidad con compatibilidad garantizada
          </p>
        </div>
        {onSelectCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-primary hover:text-primary-hover text-sm font-bold flex items-center gap-1 group transition-colors"
          >
            Ver todas las categorías
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Grid de Categorías */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {CATEGORIAS_API.map((cat) => {
          const Icon = getCategoriaIcon(cat.nombre);
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all duration-200 group ${
                isSelected
                  ? "bg-primary text-surface border-primary shadow-lg shadow-primary/30 scale-105"
                  : "bg-surface border-border hover:border-primary hover:shadow-md hover:-translate-y-1 text-ink"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                  isSelected
                    ? "bg-surface/20 text-surface"
                    : "bg-primary-tint text-primary group-hover:bg-primary group-hover:text-surface"
                }`}
              >
                <Icon className="w-7 h-7" />
              </div>
              <span className="font-bold text-xs sm:text-sm leading-snug">
                {cat.nombre}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default Categorias;

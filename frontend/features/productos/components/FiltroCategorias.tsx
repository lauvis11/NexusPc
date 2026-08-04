"use client";

import { useState } from "react";
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeft,
  SlidersHorizontal,
  RotateCcw,
  Tag,
} from "lucide-react";

export interface SubcategoriaItem {
  id: number;
  nombre: string;
}

export interface CategoriaItem {
  id: string;
  nombre: string;
  subcategorias?: SubcategoriaItem[];
}

// Muestra de Categorías y Subcategorías (con IDs numéricos para la API)
export const CATEGORIAS_TREE_DEFAULT: CategoriaItem[] = [
  {
    id: "placas-de-video",
    nombre: "Placas de Video",
    subcategorias: [
      { id: 1, nombre: "NVIDIA GeForce" },
      { id: 2, nombre: "AMD Radeon" },
    ],
  },
  {
    id: "procesadores",
    nombre: "Procesadores",
    subcategorias: [
      { id: 3, nombre: "Intel Core" },
      { id: 4, nombre: "AMD Ryzen" },
    ],
  },
  {
    id: "notebooks",
    nombre: "Notebooks",
    subcategorias: [
      { id: 5, nombre: "Gamer" },
      { id: 6, nombre: "Oficina / Trabajo" },
    ],
  },
  {
    id: "mothers",
    nombre: "Mothers",
    subcategorias: [
      { id: 7, nombre: "Socket AM5 (AMD)" },
      { id: 8, nombre: "Socket AM4 (AMD)" },
      { id: 9, nombre: "LGA 1700 (Intel)" },
    ],
  },
  {
    id: "memorias-ram",
    nombre: "Memorias RAM",
    subcategorias: [
      { id: 10, nombre: "DDR5" },
      { id: 11, nombre: "DDR4" },
      { id: 12, nombre: "SODIMM Notebook" },
    ],
  },
  {
    id: "almacenamiento",
    nombre: "Almacenamiento",
    subcategorias: [
      { id: 13, nombre: "SSD NVMe M.2" },
      { id: 14, nombre: "SSD SATA 2.5\"" },
      { id: 15, nombre: "Discos Rígidos HDD" },
    ],
  },
  {
    id: "perifericos",
    nombre: "Periféricos",
    subcategorias: [
      { id: 16, nombre: "Teclados" },
      { id: 17, nombre: "Mouses" },
      { id: 18, nombre: "Auriculares" },
      { id: 19, nombre: "Micrófonos" },
    ],
  },
  {
    id: "monitores",
    nombre: "Monitores",
    subcategorias: [
      { id: 20, nombre: "Gaming 144Hz+" },
      { id: 21, nombre: "4K / Ultra HD" },
      { id: 22, nombre: "UltraWide" },
    ],
  },
  {
    id: "gabinetes",
    nombre: "Gabinetes",
    subcategorias: [
      { id: 23, nombre: "Mid Tower" },
      { id: 24, nombre: "Full Tower" },
    ],
  },
  {
    id: "refrigeracion",
    nombre: "Refrigeración",
    subcategorias: [
      { id: 25, nombre: "Water Cooling" },
      { id: 26, nombre: "Disipadores por Aire" },
    ],
  },
];

export interface FiltrosState {
  categoria: string | null;
  subcategoria_id: number | null;
  precio_min: string;
  precio_max: string;
  en_stock: boolean;
}

interface FiltroCategoriasProps {
  categoriasTree?: CategoriaItem[];
  filtros: FiltrosState;
  onChangeFiltros: (nuevosFiltros: FiltrosState) => void;
  showHeader?: boolean;
}

export function FiltroCategorias({
  categoriasTree = CATEGORIAS_TREE_DEFAULT,
  filtros,
  onChangeFiltros,
  showHeader = true,
}: FiltroCategoriasProps) {
  // Estado local para acordeón desplegable en vista de categorías
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  // Buscar objeto de categoría activa si existe
  const activeCategoryObj = categoriasTree.find(
    (c) => c.nombre.toLowerCase() === filtros.categoria?.toLowerCase() || c.id === filtros.categoria
  );

  const toggleAccordion = (catId: string) => {
    setOpenCategoryId((prev) => (prev === catId ? null : catId));
  };

  const handleSelectCategory = (cat: CategoriaItem) => {
    onChangeFiltros({
      ...filtros,
      categoria: cat.nombre,
      subcategoria_id: null,
    });
  };

  const handleClearCategory = () => {
    onChangeFiltros({
      ...filtros,
      categoria: null,
      subcategoria_id: null,
    });
  };

  const handleSelectSubcategoria = (subId: number) => {
    onChangeFiltros({
      ...filtros,
      subcategoria_id: filtros.subcategoria_id === subId ? null : subId,
    });
  };

  const handleResetFiltros = () => {
    onChangeFiltros({
      ...filtros,
      subcategoria_id: null,
      precio_min: "",
      precio_max: "",
      en_stock: false,
    });
  };

  // ── MODO 1: SIN CATEGORÍA SELECCIONADA → MOSTRAR ÁRBOL DE CATEGORÍAS ──────
  if (!filtros.categoria) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h3 className="font-extrabold text-ink text-base tracking-tight flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-primary" />
              <span>Categorías</span>
            </h3>
          </div>
        )}

        <div className="space-y-1">
          {categoriasTree.map((cat) => {
            const isOpen = openCategoryId === cat.id;
            const hasSub = !!cat.subcategorias?.length;

            return (
              <div key={cat.id} className="rounded-xl overflow-hidden">
                {/* Fila Categoría Principal */}
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer text-ink hover:bg-surface-alt hover:text-primary font-semibold"
                  onClick={() => {
                    handleSelectCategory(cat);
                  }}
                >
                  <span className="text-xs sm:text-sm">{cat.nombre}</span>

                  {hasSub && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAccordion(cat.id);
                      }}
                      className="p-1 text-ink-secondary hover:text-primary transition-transform cursor-pointer rounded-lg hover:bg-surface"
                      aria-label="Desplegar subcategorías"
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-primary" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-ink-secondary" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subcategorías Desplegables */}
                {hasSub && isOpen && (
                  <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-primary/20 ml-3 my-1">
                    {cat.subcategorias!.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => {
                          handleSelectCategory(cat);
                          handleSelectSubcategoria(sub.id);
                        }}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-ink-secondary hover:text-primary hover:bg-primary-tint/40 font-medium"
                      >
                        <span>{sub.nombre}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── MODO 2: CATEGORÍA SELECCIONADA → OCULTAR CATEGORÍAS Y MOSTRAR "FILTROS" ──────
  return (
    <div className="space-y-5">
      {/* Header con botón Volver a Categorías */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <button
          onClick={handleClearCategory}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:underline cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Todas las categorías</span>
        </button>
      </div>

      {/* Badge de Categoría Activa */}
      <div className="bg-primary-tint/70 border border-primary/30 p-3 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary shrink-0" />
          <span className="font-extrabold text-ink text-xs sm:text-sm">
            {activeCategoryObj?.nombre || filtros.categoria}
          </span>
        </div>
        <button
          onClick={handleClearCategory}
          className="text-xs font-bold text-ink-secondary hover:text-primary transition-colors cursor-pointer"
          title="Quitar categoría"
        >
          Cambiar
        </button>
      </div>

      {/* Sección de Filtros Activos (Filtros API NexusPC) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-ink text-sm tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Filtros</span>
          </h4>
          <button
            onClick={handleResetFiltros}
            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        </div>

        {/* Subcategorías de la categoría seleccionada (si tiene) */}
        {activeCategoryObj?.subcategorias && activeCategoryObj.subcategorias.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-border/40">
            <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
              Subcategorías
            </h5>
            <div className="space-y-1">
              {activeCategoryObj.subcategorias.map((sub) => {
                const isSelected = filtros.subcategoria_id === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubcategoria(sub.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white font-bold shadow-2xs"
                        : "text-ink-secondary hover:text-ink hover:bg-surface-alt font-medium"
                    }`}
                  >
                    <span>{sub.nombre}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Disponibilidad (en_stock) */}
        <div className="space-y-2 pt-3 border-t border-border/40">
          <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
            Disponibilidad
          </h5>
          <label className="flex items-center gap-2.5 text-xs font-medium text-ink-secondary hover:text-ink cursor-pointer py-0.5">
            <input
              type="checkbox"
              checked={filtros.en_stock}
              onChange={(e) =>
                onChangeFiltros({ ...filtros, en_stock: e.target.checked })
              }
              className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <span>Solo en stock</span>
          </label>
        </div>

        {/* Rango de Precio (precio_min / precio_max) */}
        <div className="space-y-2 pt-3 border-t border-border/40">
          <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
            Rango de Precio
          </h5>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Mín ARS"
              value={filtros.precio_min}
              onChange={(e) =>
                onChangeFiltros({ ...filtros, precio_min: e.target.value })
              }
              className="w-full bg-surface-alt border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink focus:border-primary outline-none"
            />
            <span className="text-ink-secondary text-xs">-</span>
            <input
              type="number"
              placeholder="Máx ARS"
              value={filtros.precio_max}
              onChange={(e) =>
                onChangeFiltros({ ...filtros, precio_max: e.target.value })
              }
              className="w-full bg-surface-alt border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltroCategorias;

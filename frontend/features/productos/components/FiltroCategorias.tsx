"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  ChevronDown,
  Check,
  SlidersHorizontal,
  RotateCcw,
  Tag,
  X,
  AlertCircle,
} from "lucide-react";
import { getCategorias, getSubCategorias } from "../api/productos";

export interface SubcategoriaItem {
  id: number;
  nombre: string;
}

export interface CategoriaItem {
  id: string;
  nombre: string;
  subcategorias?: SubcategoriaItem[];
}

// Fallback por defecto en caso de no poder conectar con la API
export const CATEGORIAS_TREE_DEFAULT: CategoriaItem[] = [
  {
    id: "1",
    nombre: "Procesadores",
  },
  {
    id: "2",
    nombre: "Notebooks",
  },
  {
    id: "3",
    nombre: "Mothers",
  },
  {
    id: "4",
    nombre: "Placas de Video",
    subcategorias: [
      { id: 1, nombre: "Placas de Video Nvidia" },
      { id: 2, nombre: "Placas de video AMD" },
    ],
  },
  {
    id: "5",
    nombre: "Memorias Ram",
  },
  {
    id: "6",
    nombre: "Almacenamiento",
  },
  {
    id: "7",
    nombre: "Perifericos",
    subcategorias: [
      { id: 3, nombre: "Teclados" },
      { id: 4, nombre: "Mouses" },
      { id: 5, nombre: "Auriculares" },
      { id: 6, nombre: "Mouse Pads" },
      { id: 7, nombre: "Microfonos" },
      { id: 8, nombre: "Camaras" },
    ],
  },
  {
    id: "8",
    nombre: "Sillas Gamers",
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
  categoriasTree: propCategoriasTree,
  filtros,
  onChangeFiltros,
  showHeader = true,
}: FiltroCategoriasProps) {
  const [categoriasTree, setCategoriasTree] = useState<CategoriaItem[]>(
    propCategoriasTree ?? []
  );
  const [loading, setLoading] = useState(!propCategoriasTree);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  // El menú de categorías del sidebar es desplegable.
  // Si hay categoría seleccionada, por defecto se mantiene NO desplegado.
  // Si no hay categoría seleccionada, arranca desplegado para explorar.
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState<boolean>(!filtros.categoria);

  // Sincronizar el despliegue del menú cuando cambia la categoría seleccionada
  useEffect(() => {
    if (filtros.categoria) {
      setSidebarMenuOpen(false);
    } else {
      setSidebarMenuOpen(true);
    }
  }, [filtros.categoria]);

  // Fetch dinámico de Categorías y Subcategorías desde la API
  useEffect(() => {
    if (propCategoriasTree) return;

    async function fetchCategoriasYSubcategorias() {
      setLoading(true);
      try {
        const [cats, subs] = await Promise.all([
          getCategorias(),
          getSubCategorias(),
        ]);

        const tree: CategoriaItem[] = cats.map((cat) => ({
          id: String(cat.id),
          nombre: cat.nombre,
          subcategorias: subs
            .filter((sub) => sub.categoria_id === cat.id)
            .map((sub) => ({
              id: sub.id,
              nombre: sub.nombre,
            })),
        }));

        setCategoriasTree(tree.length > 0 ? tree : CATEGORIAS_TREE_DEFAULT);
      } catch {
        setCategoriasTree(CATEGORIAS_TREE_DEFAULT);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoriasYSubcategorias();
  }, [propCategoriasTree]);

  const treeToUse = categoriasTree.length > 0 ? categoriasTree : CATEGORIAS_TREE_DEFAULT;

  // Buscar objeto de categoría activa si existe
  const activeCategoryObj = treeToUse.find(
    (c) =>
      c.nombre.toLowerCase() === filtros.categoria?.toLowerCase() ||
      c.id === filtros.categoria
  );

  const toggleCategoryAccordion = (catId: string) => {
    setOpenCategoryId((prev) => (prev === catId ? null : catId));
  };

  const handleSelectCategory = (cat: CategoriaItem) => {
    onChangeFiltros({
      ...filtros,
      categoria: cat.nombre,
      subcategoria_id: null,
    });
    setSidebarMenuOpen(false);
  };

  const handleClearCategory = () => {
    onChangeFiltros({
      ...filtros,
      categoria: null,
      subcategoria_id: null,
      precio_min: "",
      precio_max: "",
      en_stock: false,
    });
    setSidebarMenuOpen(true);
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

  // Skeleton Loader mientras consulta la API
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {showHeader && (
          <div className="border-b border-border/50 pb-3">
            <div className="h-5 w-32 bg-slate-200 rounded" />
          </div>
        )}
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-full bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const hasAdditionalFilters =
    Boolean(filtros.precio_min) ||
    Boolean(filtros.precio_max) ||
    filtros.en_stock ||
    filtros.subcategoria_id !== null;

  return (
    <div className="space-y-4">
      {/* ── 1. TARJETA DE CATEGORÍA SELECCIONADA (si hay categoría activa) ── */}
      {filtros.categoria && (
        <div className="bg-primary text-white rounded-2xl p-4 space-y-3 shadow-md transition-all animate-fade-in">
          {/* Nombre de la categoría a la izquierda y acción de quitar a la derecha */}
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-black text-white text-sm sm:text-base tracking-tight truncate">
              {activeCategoryObj?.nombre || filtros.categoria}
            </h4>

            <button
              onClick={handleClearCategory}
              className="inline-flex items-center gap-1 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Quitar categoría seleccionada"
            >
              <X className="w-3.5 h-3.5 text-white" />
              <span>Quitar</span>
            </button>
          </div>

          {/* Subcategorías asociadas si existen */}
          {activeCategoryObj?.subcategorias && activeCategoryObj.subcategorias.length > 0 && (
            <div className="pt-2.5 border-t border-white/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/80">
                  Subcategorías
                </span>
                {filtros.subcategoria_id !== null && (
                  <button
                    onClick={() => handleSelectSubcategoria(filtros.subcategoria_id!)}
                    className="text-[10px] font-bold text-white hover:underline cursor-pointer"
                  >
                    Ver todas
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeCategoryObj.subcategorias.map((sub) => {
                  const isSelected = filtros.subcategoria_id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSelectSubcategoria(sub.id)}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                        isSelected
                          ? "bg-white text-primary font-bold shadow-xs"
                          : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                      }`}
                    >
                      <span>{sub.nombre}</span>
                      {isSelected && <Check className="w-3 h-3 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 2. MENÚ DESPLEGABLE DEL SIDEBAR (CATEGORÍAS) ── */}
      <div className="rounded-2xl border border-border/80 bg-surface overflow-hidden transition-all shadow-2xs">
        {/* Encabezado desplegable para todo el bloque de categorías */}
        <button
          type="button"
          onClick={() => setSidebarMenuOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-surface-alt transition-colors cursor-pointer text-left select-none group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-primary-tint/70 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Layers className="w-4 h-4" />
            </span>
            <span className="font-extrabold text-xs sm:text-sm text-ink block truncate">
              Categorías
            </span>
          </div>

          <div
            className={`p-1.5 rounded-lg transition-transform duration-300 ${
              sidebarMenuOpen ? "rotate-180 text-primary bg-primary-tint/50" : "rotate-0 text-ink-secondary"
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {/* Contenedor colapsable del menú de categorías */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{
            gridTemplateRows: sidebarMenuOpen ? "1fr" : "0fr",
          }}
        >
          <div className="overflow-hidden">
            <div className="p-3 pt-1 space-y-1 border-t border-border/50">
              {treeToUse.map((cat) => {
                const isCurrentActive =
                  cat.nombre.toLowerCase() === filtros.categoria?.toLowerCase() ||
                  cat.id === filtros.categoria;
                const isAccordionOpen = openCategoryId === cat.id;
                const hasSub = !!cat.subcategorias?.length;

                return (
                  <div key={cat.id} className="rounded-xl overflow-hidden">
                    {/* Fila de categoría individual */}
                    <div
                      className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                        isCurrentActive
                          ? "bg-primary text-white shadow-2xs font-bold"
                          : isAccordionOpen
                          ? "bg-primary-tint/60 text-primary font-bold"
                          : "text-ink hover:bg-surface-alt hover:text-primary"
                      }`}
                      onClick={() => {
                        if (hasSub) {
                          toggleCategoryAccordion(cat.id);
                        } else {
                          handleSelectCategory(cat);
                        }
                      }}
                    >
                      <span className="truncate">{cat.nombre}</span>
                      {hasSub && (
                        <div
                          className={`p-0.5 transition-transform duration-200 ${
                            isAccordionOpen ? "rotate-180" : "rotate-0"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategoryAccordion(cat.id);
                          }}
                        >
                          <ChevronDown
                            className={`w-3.5 h-3.5 ${
                              isCurrentActive ? "text-white" : "text-ink-secondary"
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Subcategorías desplegables de la categoría */}
                    {hasSub && (
                      <div
                        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
                        style={{
                          gridTemplateRows: isAccordionOpen ? "1fr" : "0fr",
                        }}
                      >
                        <div className="overflow-hidden">
                          <div className="pl-3.5 pr-1 py-1 space-y-0.5 border-l-2 border-primary/25 ml-3 my-1">
                            {/* Botón para ver toda la categoría */}
                            <div
                              onClick={() => handleSelectCategory(cat)}
                              className="flex items-center justify-between px-2 py-1 rounded-lg text-[11px] transition-all cursor-pointer text-primary hover:bg-primary-tint/40 font-bold"
                            >
                              <span>Ver todos en {cat.nombre}</span>
                            </div>

                            {/* Subcategorías individuales */}
                            {cat.subcategorias!.map((sub) => (
                              <div
                                key={sub.id}
                                onClick={() => {
                                  handleSelectCategory(cat);
                                  handleSelectSubcategoria(sub.id);
                                }}
                                className="flex items-center justify-between px-2 py-1 rounded-lg text-[11px] transition-all cursor-pointer text-ink-secondary hover:text-primary hover:bg-primary-tint/40 font-medium"
                              >
                                <span>{sub.nombre}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. FILTROS ADICIONALES (PRECIO Y DISPONIBILIDAD) ── */}
      <div className="rounded-2xl border border-border/80 bg-surface p-4 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <h4 className="font-extrabold text-ink text-xs sm:text-sm tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Filtros</span>
          </h4>
          {filtros.categoria && hasAdditionalFilters && (
            <button
              onClick={handleResetFiltros}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              title="Restablecer filtros"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {filtros.categoria ? (
          <>
            {/* Disponibilidad */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-secondary">
                Disponibilidad
              </span>
              <label className="flex items-center gap-2 text-xs font-medium text-ink hover:text-primary cursor-pointer py-1 select-none">
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

            {/* Rango de Precio */}
            <div className="space-y-1.5 pt-2 border-t border-border/40">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-secondary">
                Rango de Precio (ARS)
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filtros.precio_min}
                  onChange={(e) =>
                    onChangeFiltros({ ...filtros, precio_min: e.target.value })
                  }
                  className="w-full bg-surface-alt border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink focus:border-primary outline-none"
                />
                <span className="text-ink-secondary text-xs">-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={filtros.precio_max}
                  onChange={(e) =>
                    onChangeFiltros({ ...filtros, precio_max: e.target.value })
                  }
                  className="w-full bg-surface-alt border border-border rounded-lg px-2.5 py-1.5 text-xs text-ink focus:border-primary outline-none"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 py-1">
            <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
            <p className="text-xs text-black font-semibold leading-snug">
              Selecciona una categoría para utilizar los filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

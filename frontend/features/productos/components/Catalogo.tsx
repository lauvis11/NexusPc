"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductoCard } from "./ProductoCard";
import {
  FiltroCategorias,
  FiltrosState,
} from "./FiltroCategorias";
import type { Producto, ProductosResponse } from "../types/types";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
  AlertCircle,
  RotateCcw,
  SearchX,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type OrdenOption = "relevancia" | "precio_asc" | "precio_desc" | "recientes";

function buildQueryString(
  filtros: FiltrosState,
  page: number,
  limit: number
): string {
  const params = new URLSearchParams();

  if (filtros.categoria) params.set("categoria", filtros.categoria);
  if (filtros.subcategoria_id != null) params.set("subcategoria_id", String(filtros.subcategoria_id));
  if (filtros.precio_min) params.set("precio_min", filtros.precio_min);
  if (filtros.precio_max) params.set("precio_max", filtros.precio_max);
  if (filtros.en_stock) params.set("en_stock", "true");

  params.set("page", String(page));
  params.set("limit", String(limit));

  return params.toString();
}

export function Catalogo() {
  const [filtros, setFiltros] = useState<FiltrosState>({
    categoria: null,
    subcategoria_id: null,
    precio_min: "",
    precio_max: "",
    en_stock: false,
  });
  const [orden, setOrden] = useState<OrdenOption>("relevancia");
  const [page, setPage] = useState(1);
  const limit = 12;

  const [productos, setProductos] = useState<Producto[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const qs = buildQueryString(filtros, page, limit);
      const res = await fetch(`${API_URL}/productos?${qs}`);
      if (!res.ok) throw new Error("Error al obtener productos");
      const data: ProductosResponse = await res.json();
      setProductos(data.data ?? []);
      setPagination(data.pagination);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filtros, page, orden]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleChangeFiltros = (nuevosFiltros: FiltrosState) => {
    setFiltros(nuevosFiltros);
    setPage(1);
  };

  const handleOrdenChange = (value: OrdenOption) => {
    setOrden(value);
    setPage(1);
  };

  const generatePageNumbers = (): (number | "...")[] => {
    const { totalPages } = pagination;
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "...")[] = [];
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {Array.from({ length: limit }).map((_, i) => (
        <div
          key={i}
          className="bg-surface border border-border p-3 sm:p-5 rounded-xl sm:rounded-2xl animate-pulse flex flex-col h-72 sm:h-96"
        >
          <div className="h-36 sm:h-56 w-full bg-slate-200 rounded-lg sm:rounded-xl mb-3" />
          <div className="space-y-2">
            <div className="h-3 w-16 bg-slate-200 rounded" />
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
          </div>
          <div className="mt-auto pt-2 flex justify-between items-center">
            <div className="space-y-1.5">
              <div className="h-5 w-24 bg-slate-200 rounded" />
              <div className="h-3 w-14 bg-slate-200 rounded" />
            </div>
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-200 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Banner Superior / Header de Página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 pb-4 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
            Catálogo de <span className="text-primary font-black">Productos</span>
          </h1>
          {!loading && (
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              {pagination.total} producto{pagination.total !== 1 ? "s" : ""} encontrado{pagination.total !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Acciones: Filtros mobile & Selector Ordenar */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-xs font-bold text-ink hover:border-primary transition-all cursor-pointer shadow-2xs"
          >
            {filtros.categoria ? (
              <SlidersHorizontal className="w-4 h-4 text-primary" />
            ) : (
              <Layers className="w-4 h-4 text-primary" />
            )}
            <span>{filtros.categoria ? "Filtros Activos" : "Categorías"}</span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Ordenar:
            </span>
            <select
              value={orden}
              onChange={(e) => handleOrdenChange(e.target.value as OrdenOption)}
              className="bg-surface border border-border rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-ink focus:border-primary outline-none cursor-pointer shadow-2xs"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio_asc">Precio: Menor a Mayor</option>
              <option value="precio_desc">Precio: Mayor a Menor</option>
              <option value="recientes">Más recientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout Grid: Filtros + Grilla */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ── SIDEBAR FILTROS (Desktop) ─────────────────────────── */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs sticky top-28">
            <FiltroCategorias
              filtros={filtros}
              onChangeFiltros={handleChangeFiltros}
            />
          </div>
        </aside>

        {/* ── CANVAS PRINCIPAL: Grilla de Productos ───────────── */}
        <section className="flex-1">

          {/* Estado de Carga */}
          {loading && <SkeletonGrid />}

          {/* Estado de Error */}
          {!loading && error && (
            <div className="h-96 w-full flex flex-col items-center justify-center p-6 text-center border border-border/80 bg-surface rounded-2xl shadow-xs">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mb-3.5 shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-ink mb-4">
                No se pudieron cargar los productos
              </h3>
              <button
                onClick={fetchProductos}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-primary text-surface font-bold text-xs sm:text-sm hover:bg-primary-hover active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reintentar</span>
              </button>
            </div>
          )}

          {/* Sin Resultados */}
          {!loading && !error && productos.length === 0 && (
            <div className="h-96 w-full flex flex-col items-center justify-center p-6 text-center border border-border/80 bg-surface rounded-2xl shadow-xs">
              <SearchX className="w-10 h-10 sm:w-12 sm:h-12 text-ink-secondary mb-3.5 shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-ink mb-2">
                No se encontraron productos
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary mb-4 max-w-sm">
                Probá ajustando los filtros o buscando en otra categoría.
              </p>
              <button
                onClick={() => {
                  setFiltros({
                    categoria: null,
                    subcategoria_id: null,
                    precio_min: "",
                    precio_max: "",
                    en_stock: false,
                  });
                  setPage(1);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-primary text-surface font-bold text-xs sm:text-sm hover:bg-primary-hover active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Limpiar filtros</span>
              </button>
            </div>
          )}

          {/* Grilla de Productos */}
          {!loading && !error && productos.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {productos.map((producto) => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-border/50">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="w-9 h-9 rounded-xl border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {generatePageNumbers().map((p, idx) =>
                    p === "..." ? (
                      <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-ink-secondary text-xs font-bold">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                          p === page
                            ? "bg-primary text-surface"
                            : "border border-border bg-surface text-ink hover:border-primary hover:text-primary"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page >= pagination.totalPages}
                    className="w-9 h-9 rounded-xl border border-border bg-surface text-ink hover:border-primary hover:text-primary flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

      </div>

      {/* ── MOBILE FILTROS DRAWER ───────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-80 max-w-full h-full bg-surface shadow-2xl flex flex-col z-10 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <h3 className="font-black text-ink text-lg tracking-tight flex items-center gap-2">
                {filtros.categoria ? (
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                ) : (
                  <Layers className="w-5 h-5 text-primary" />
                )}
                <span>{filtros.categoria ? "Filtros" : "Categorías"}</span>
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-ink-secondary hover:text-primary rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FiltroCategorias
              filtros={filtros}
              onChangeFiltros={handleChangeFiltros}
              showHeader={false}
            />

            <div className="pt-4 border-t border-border/50 flex items-center gap-3 mt-auto">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-primary text-surface font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Catalogo;

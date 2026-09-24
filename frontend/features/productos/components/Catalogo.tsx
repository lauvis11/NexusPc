"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductoCard } from "./ProductoCard";
import {
  FiltroCategorias,
  TarjetaCategoriaActiva,
  FiltrosState,
} from "./FiltroCategorias";
import type { Producto, ProductosResponse } from "../types/types";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Layers,
  AlertCircle,
  RotateCcw,
  SearchX,
  Search,
} from "lucide-react";
import { API_URL } from "@/lib/constants";

type OrdenOption = "relevancia" | "precio_asc" | "precio_desc" | "recientes";

function buildQueryString(
  filtros: FiltrosState,
  page: number,
  limit: number,
  busqueda?: string | null
): string {
  const params = new URLSearchParams();

  if (busqueda && busqueda.trim()) params.set("busqueda", busqueda.trim());
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const busquedaFromUrl = searchParams.get("busqueda") || searchParams.get("q") || searchParams.get("search") || null;
  const categoriaFromUrl = searchParams.get("categoria");
  const subcategoriaFromUrl = searchParams.get("subcategoria_id");

  const [filtros, setFiltros] = useState<FiltrosState>({
    categoria: categoriaFromUrl || null,
    subcategoria_id: subcategoriaFromUrl ? Number(subcategoriaFromUrl) : null,
    precio_min: searchParams.get("precio_min") || "",
    precio_max: searchParams.get("precio_max") || "",
    en_stock: searchParams.get("en_stock") === "true",
  });
  const [orden, setOrden] = useState<OrdenOption>("relevancia");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Sincronizar filtros si cambia la URL (al navegar desde el Navbar o enlaces)
  useEffect(() => {
    setFiltros((prev) => ({
      ...prev,
      categoria: categoriaFromUrl || null,
      subcategoria_id: subcategoriaFromUrl ? Number(subcategoriaFromUrl) : null,
    }));
    setPage(1);
  }, [categoriaFromUrl, subcategoriaFromUrl, busquedaFromUrl]);

  const [productos, setProductos] = useState<Producto[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mobileOpenSection, setMobileOpenSection] = useState<"categorias" | "filtros" | null>(null);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const qs = buildQueryString(filtros, page, limit, busquedaFromUrl);
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
  }, [filtros, page, orden, busquedaFromUrl]);

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
      {/* Banner Superior: Botón Volver + Título + Selector Ordenar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-border/50">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="p-1 sm:p-1.5 -ml-1 rounded-xl text-primary hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            title="Volver atrás"
            aria-label="Volver atrás"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight truncate">
            Productos
          </h1>
        </div>

        {/* Selector Ordenar: compacto en móvil para evitar superposiciones */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <label htmlFor="ordenar-select" className="hidden sm:inline text-xs font-bold text-ink-secondary uppercase tracking-wider">
            Ordenar por:
          </label>
          <div className="relative">
            <select
              id="ordenar-select"
              value={orden}
              onChange={(e) => handleOrdenChange(e.target.value as OrdenOption)}
              className="bg-surface border border-border rounded-xl pl-2.5 pr-7 py-1.5 sm:pl-3 sm:pr-8 sm:py-1.5 text-xs font-semibold text-ink focus:border-primary outline-none cursor-pointer shadow-2xs appearance-none"
              aria-label="Ordenar productos"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
              <option value="recientes">Más recientes</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-secondary absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── BOTONES RESPONSIVE / PANEL DESPLEGABLE A ANCHO COMPLETO ── */}
      <div className="lg:hidden mb-6 space-y-3">
        {/* Tarjeta de categoría activa: si hay categoría seleccionada, siempre se muestra arriba */}
        {filtros.categoria && (
          <TarjetaCategoriaActiva
            filtros={filtros}
            onChangeFiltros={handleChangeFiltros}
          />
        )}

        {mobileOpenSection === null ? (
          /* Cuando ningún menú está abierto, se muestran los dos botones lado a lado con el mismo tamaño */
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Botón Categorías */}
            <button
              type="button"
              onClick={() => setMobileOpenSection("categorias")}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-surface text-ink border border-border hover:border-primary transition-all cursor-pointer shadow-2xs"
            >
              <Layers className="w-4 h-4 text-primary" />
              <span>Categorías</span>
            </button>

            {/* Botón Filtros */}
            <button
              type="button"
              onClick={() => setMobileOpenSection("filtros")}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-surface text-ink border border-border hover:border-primary transition-all cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>Filtros</span>
            </button>
          </div>
        ) : (
          /* Reutilizamos directamente el menú ocupando todo el ancho, sin contenedores redundantes */
          <div className="w-full animate-fade-in">
            <FiltroCategorias
              filtros={filtros}
              onChangeFiltros={handleChangeFiltros}
              mode={mobileOpenSection}
              onCloseMobile={() => setMobileOpenSection(null)}
              hideActiveCard={true}
            />
          </div>
        )}
      </div>

      {/* Layout Grid: Filtros + Grilla */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ── SIDEBAR FILTROS (Desktop) ─────────────────────────── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28 space-y-4">
            <FiltroCategorias
              filtros={filtros}
              onChangeFiltros={handleChangeFiltros}
            />
          </div>
        </aside>

        {/* ── CANVAS PRINCIPAL: Grilla de Productos ───────────── */}
        <section className="flex-1">
          {/* Banner de Búsqueda Activa */}
          {busquedaFromUrl && (
            <div className="flex items-center justify-between gap-3 mb-5 p-3.5 bg-primary-tint/50 border border-primary/20 rounded-2xl animate-fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs sm:text-sm text-ink truncate">
                  Resultados para: <strong className="text-primary font-extrabold font-mono">&quot;{busquedaFromUrl}&quot;</strong>
                </span>
              </div>
              <Link
                href="/productos"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-alt border border-border text-xs font-bold text-ink-secondary hover:text-red-500 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
                title="Quitar filtro de búsqueda"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpiar búsqueda</span>
              </Link>
            </div>
          )}

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
    </>
  );
}

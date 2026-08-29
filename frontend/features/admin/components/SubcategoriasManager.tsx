"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import { Categoria, SubCategoria } from "@/features/productos/types/types";
import { getCategorias, getSubCategorias } from "@/features/productos/api/productos";

export function SubcategoriasManager() {
  const [subcategorias, setSubcategorias] = useState<SubCategoria[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCategoriaFilter, setSelectedCategoriaFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");

  // Carga inicial de Subcategorías y Categorías desde la API
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const [subcatsData, catsData] = await Promise.all([
          getSubCategorias(),
          getCategorias(),
        ]);
        setSubcategorias(subcatsData);
        setCategorias(catsData);
        if (catsData.length > 0) {
          setCategoriaId(catsData[0].id);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const getCategoriaNombre = (catId: number) => {
    return categorias.find((c) => c.id === catId)?.nombre || `Categoría #${catId}`;
  };

  const filteredSubcategorias = subcategorias.filter((sub) => {
    const matchesSearch = sub.nombre
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCat =
      selectedCategoriaFilter === "all" ||
      String(sub.categoria_id) === selectedCategoriaFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenModal = () => {
    setNombre("");
    if (categorias.length > 0) {
      setCategoriaId(categorias[0].id);
    }
    setIsModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || categoriaId === "") return;

    // Próximo paso: conectar crearSubcategoria
    const nueva: SubCategoria = {
      id: Date.now(),
      nombre: nombre.trim(),
      categoria_id: Number(categoriaId),
    };
    setSubcategorias((prev) => [...prev, nueva]);
    setNombre("");
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    // Próximo paso: conectar eliminarSubcategoria
    setSubcategorias((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            Subcategorías
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Gestione las subcategorías vinculadas a cada categoría padre.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategoriaFilter}
              onChange={(e) => setSelectedCategoriaFilter(e.target.value)}
              className="w-full sm:w-48 pl-3.5 pr-8 py-2 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
            >
              <option value="all">Todas las Categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar subcategoría..."
              className="w-full pl-10 pr-3.5 py-2 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-primary/30 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nueva Subcategoría
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-2xl flex items-center justify-between gap-3 text-danger text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:bg-danger/20 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Data Table Card */}
      <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary w-28">
                  ID
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Nombre
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Categoría Padre
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary text-right w-28">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-ink-secondary">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm font-medium">Cargando subcategorías...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSubcategorias.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-ink-secondary text-sm"
                  >
                    No se encontraron subcategorías.
                  </td>
                </tr>
              ) : (
                filteredSubcategorias.map((sub, idx) => (
                  <tr
                    key={sub.id}
                    className={`transition-colors hover:bg-primary-tint/40 group ${
                      idx % 2 === 1 ? "bg-surface-alt/40" : "bg-surface"
                    }`}
                  >
                    <td className="px-6 py-4 font-mono font-medium text-ink-secondary text-xs">
                      #{String(sub.id).padStart(3, "0")}
                    </td>
                    <td className="px-6 py-4 font-semibold text-ink">
                      {sub.nombre}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-tint text-primary border border-primary/20">
                        {getCategoriaNombre(sub.categoria_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        title="Eliminar subcategoría"
                        className="p-2 text-ink-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors focus:outline-none cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 flex items-center justify-between border-t border-border bg-surface-alt/60 text-xs text-ink-secondary font-medium">
          <span>
            Mostrando {filteredSubcategorias.length} de {subcategorias.length}{" "}
            subcategorías
          </span>
        </div>
      </div>

      {/* Modal Nueva Subcategoría */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md p-6 border border-border z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Nueva Subcategoría</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-ink-secondary hover:bg-surface-alt rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                  Nombre de la Subcategoría
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Placas de Video NVIDIA"
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                  Categoría Padre
                </label>
                <select
                  required
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border bg-surface hover:bg-surface-alt text-ink rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!nombre.trim() || categoriaId === ""}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2 rounded-xl shadow-sm shadow-primary/30 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

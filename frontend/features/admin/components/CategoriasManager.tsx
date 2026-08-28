"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import { Categoria } from "@/features/productos/types/types";
import { getCategorias } from "@/features/productos/api/productos";

export function CategoriasManager() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");

  // Carga inicial de categorías usando getCategorias existente
  useEffect(() => {
    async function loadCategorias() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCategorias();
        setCategorias(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar categorías");
      } finally {
        setIsLoading(false);
      }
    }

    loadCategorias();
  }, []);

  const filteredCategorias = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    // Próximo paso: conectar crearCategoria
    const nueva: Categoria = {
      id: Date.now(),
      nombre: nombre.trim(),
    };
    setCategorias((prev) => [...prev, nueva]);
    setNombre("");
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    // Próximo paso: conectar eliminarCategoria
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            Categorías
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Gestione las categorías principales de productos.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar categoría..."
              className="w-full pl-10 pr-3.5 py-2 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => {
              setNombre("");
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-primary/30 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-2xl flex items-center gap-3 text-danger text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
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
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary text-right w-28">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-ink-secondary">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm font-medium">Cargando categorías...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategorias.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-ink-secondary text-sm"
                  >
                    No se encontraron categorías.
                  </td>
                </tr>
              ) : (
                filteredCategorias.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className={`transition-colors hover:bg-primary-tint/40 group ${
                      idx % 2 === 1 ? "bg-surface-alt/40" : "bg-surface"
                    }`}
                  >
                    <td className="px-6 py-4 font-mono font-medium text-ink-secondary text-xs">
                      #{String(cat.id).padStart(3, "0")}
                    </td>
                    <td className="px-6 py-4 font-semibold text-ink">
                      {cat.nombre}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        title="Eliminar categoría"
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
            Mostrando {filteredCategorias.length} de {categorias.length} categorías
          </span>
        </div>
      </div>

      {/* Modal Nueva Categoría */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md p-6 border border-border z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Nueva Categoría</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-ink-secondary hover:bg-surface-alt rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Refrigeración Líquida"
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
                />
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
                  disabled={!nombre.trim()}
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

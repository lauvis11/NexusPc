"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  X,
  Percent,
  DollarSign,
  Calendar,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Oferta, OfertasInput } from "../types/ofertas";
import { Producto } from "@/features/productos/types/types";
import { obtenerOfertas, crearOferta, actualizarOferta } from "../api/ofertas";
import { getProductos } from "@/features/productos/api/productos";
import { API_URL } from "@/lib/constants";

export function OfertasManager() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [productosList, setProductosList] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ofertaToDelete, setOfertaToDelete] = useState<Oferta | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [prodSearchTerm, setProdSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isSearchingProd, setIsSearchingProd] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredProdOptions, setFilteredProdOptions] = useState<Producto[]>([]);

  const [tipo, setTipo] = useState<"porcentaje" | "monto_fijo">("porcentaje");
  const [valor, setValor] = useState<number | "">(15);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().slice(0, 10));
  const [fechaFin, setFechaFin] = useState(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [activo, setActivo] = useState(true);

  // Carga inicial de ofertas y catálogo de productos desde la API
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const [ofertasData, prodsRes] = await Promise.all([
          obtenerOfertas(),
          getProductos(`${API_URL}/productos?limit=100`, 0),
        ]);
        setOfertas(ofertasData);
        setProductosList(prodsRes.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar las ofertas");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // 300ms Debounced product search sobre la lista real de productos
  useEffect(() => {
    if (selectedProduct) {
      setIsDropdownOpen(false);
      setIsSearchingProd(false);
      return;
    }

    if (!prodSearchTerm.trim()) {
      setFilteredProdOptions([]);
      setIsDropdownOpen(false);
      setIsSearchingProd(false);
      return;
    }

    setIsSearchingProd(true);
    setIsDropdownOpen(true);

    const timer = setTimeout(() => {
      const results = productosList.filter((p) =>
        p.nombre.toLowerCase().includes(prodSearchTerm.toLowerCase())
      );
      setFilteredProdOptions(results);
      setIsSearchingProd(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [prodSearchTerm, selectedProduct, productosList]);

  const calculateFinalPrice = (original: number, tipo: "porcentaje" | "monto_fijo", val: number) => {
    if (tipo === "porcentaje") {
      return original - (original * val) / 100;
    }
    return Math.max(0, original - val);
  };

  const filteredOfertas = ofertas.filter((of) => {
    const pNombre = of.producto_nombre || "";
    const matchesSearch =
      pNombre.toLowerCase().includes(search.toLowerCase()) ||
      String(of.id).includes(search);
    const matchesEstado =
      filterEstado === "all" ||
      (filterEstado === "activas" && of.activo) ||
      (filterEstado === "inactivas" && !of.activo);

    return matchesSearch && matchesEstado;
  });

  const openCreateModal = () => {
    setSelectedProduct(null);
    setProdSearchTerm("");
    setFilteredProdOptions([]);
    setIsDropdownOpen(false);
    setTipo("porcentaje");
    setValor(15);
    setFechaInicio(new Date().toISOString().slice(0, 10));
    setFechaFin(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    setActivo(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSelectProduct = (prod: Producto) => {
    setSelectedProduct(prod);
    setProdSearchTerm(prod.nombre);
    setIsDropdownOpen(false);
  };

  const handleClearSelectedProduct = () => {
    setSelectedProduct(null);
    setProdSearchTerm("");
    setFilteredProdOptions([]);
    setIsDropdownOpen(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || valor === "" || Number(valor) <= 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setFormError(null);

      const input: OfertasInput = {
        producto_id: selectedProduct.id,
        tipo,
        valor: Number(valor),
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        activo,
      };

      const nueva = await crearOferta(input);

      const nuevaCompleta: Oferta = {
        ...nueva,
        producto_nombre: selectedProduct.nombre,
        precio_original: selectedProduct.precio,
      };

      setOfertas((prev) => [nuevaCompleta, ...prev]);
      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al crear la oferta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActivo = async (id: number) => {
    const ofertaActual = ofertas.find((o) => o.id === id);
    if (!ofertaActual) return;

    const nuevoEstado = !ofertaActual.activo;

    // Actualización optimista en UI
    setOfertas((prev) =>
      prev.map((of) => (of.id === id ? { ...of, activo: nuevoEstado } : of))
    );

    try {
      await actualizarOferta(id, { activo: nuevoEstado });
    } catch (err: unknown) {
      // Revertir en caso de error
      setOfertas((prev) =>
        prev.map((of) => (of.id === id ? { ...of, activo: ofertaActual.activo } : of))
      );
      setError(err instanceof Error ? err.message : "Error al actualizar el estado de la oferta");
    }
  };

  const handleConfirmDelete = () => {
    // Próximo paso: conectar eliminarOferta
    if (!ofertaToDelete) return;
    setOfertas((prev) => prev.filter((of) => of.id !== ofertaToDelete.id));
    setOfertaToDelete(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            Ofertas y Promociones
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Administre descuentos especiales por porcentaje o monto fijo en productos.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-primary/30 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nueva Oferta
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
          <p className="text-xs text-ink-secondary font-bold uppercase tracking-wider">Total Ofertas</p>
          <p className="text-2xl font-black text-ink mt-1">{ofertas.length}</p>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
          <p className="text-xs text-ink-secondary font-bold uppercase tracking-wider">Activas Ahora</p>
          <p className="text-2xl font-black text-ink mt-1">
            {ofertas.filter((o) => o.activo).length}
          </p>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
          <p className="text-xs text-ink-secondary font-bold uppercase tracking-wider">Inactivas / Pausadas</p>
          <p className="text-2xl font-black text-ink mt-1">
            {ofertas.filter((o) => !o.activo).length}
          </p>
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

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por producto..."
            className="w-full pl-10 pr-3.5 py-2 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Filter by Estado */}
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="pl-3.5 pr-8 py-2 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
        >
          <option value="all">Todos los estados</option>
          <option value="activas">Solo Activas</option>
          <option value="inactivas">Solo Inactivas</option>
        </select>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary w-24">
                  ID
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Producto
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Descuento
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Precio Oferta
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Vigencia
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary text-center">
                  Estado
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary text-right w-24">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-ink-secondary">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm font-medium">Cargando ofertas...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOfertas.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-ink-secondary text-sm"
                  >
                    No se encontraron ofertas con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredOfertas.map((of, idx) => {
                  const originalPrice = of.precio_original || 0;
                  const finalPrice = calculateFinalPrice(
                    originalPrice,
                    of.tipo,
                    of.valor
                  );

                  return (
                    <tr
                      key={of.id}
                      className={`transition-colors hover:bg-primary-tint/40 group ${
                        idx % 2 === 1 ? "bg-surface-alt/40" : "bg-surface"
                      }`}
                    >
                      <td className="px-6 py-4 font-mono font-medium text-ink-secondary text-xs">
                        #{String(of.id).padStart(3, "0")}
                      </td>
                      <td className="px-6 py-4 font-semibold text-ink max-w-xs truncate">
                        {of.producto_nombre || `Producto ID: ${of.producto_id}`}
                      </td>
                      <td className="px-6 py-4">
                        {of.tipo === "porcentaje" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-tint text-primary">
                            <Percent className="w-3 h-3" />
                            {of.valor}% OFF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary/15 text-secondary">
                            <DollarSign className="w-3 h-3" />
                            -${of.valor.toLocaleString("es-AR")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-ink text-sm">
                            ${finalPrice.toLocaleString("es-AR")}
                          </span>
                          {originalPrice > 0 && (
                            <span className="text-xs text-ink-secondary line-through">
                              ${originalPrice.toLocaleString("es-AR")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-secondary whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-ink-secondary" />
                          {new Date(of.fecha_inicio).toLocaleDateString("es-AR")} al{" "}
                          {new Date(of.fecha_fin).toLocaleDateString("es-AR")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActivo(of.id)}
                          className="inline-flex items-center gap-1.5 focus:outline-none"
                          title="Click para cambiar estado"
                        >
                          {of.activo ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success hover:bg-success/25 transition-colors cursor-pointer">
                              <CheckCircle2 className="w-3 h-3" /> Activa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-border text-ink-secondary hover:bg-border/80 transition-colors cursor-pointer">
                              Pausada
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setOfertaToDelete(of)}
                          title="Eliminar oferta"
                          className="p-2 text-ink-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors focus:outline-none cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 flex items-center justify-between border-t border-border bg-surface-alt/60 text-xs text-ink-secondary font-medium">
          <span>
            Mostrando {filteredOfertas.length} de {ofertas.length} ofertas
          </span>
        </div>
      </div>

      {/* Modal Nueva Oferta */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isSubmitting && setIsModalOpen(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-lg p-6 border border-border z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-ink">Nueva Oferta</h3>
                <p className="text-xs text-ink-secondary">
                  Configure el descuento y vigencia para el producto.
                </p>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-ink-secondary hover:bg-surface-alt rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 pt-1">
              {/* Selector Producto Dinámico */}
              <div className="relative">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Producto a ofertar
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={!selectedProduct}
                    disabled={isSubmitting}
                    value={prodSearchTerm}
                    onChange={(e) => {
                      if (selectedProduct) setSelectedProduct(null);
                      setProdSearchTerm(e.target.value);
                    }}
                    onFocus={() => {
                      if (!selectedProduct && prodSearchTerm.trim()) {
                        setIsDropdownOpen(true);
                      }
                    }}
                    placeholder="Buscar producto por nombre..."
                    className="w-full pl-10 pr-10 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                  {selectedProduct && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleClearSelectedProduct}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                      title="Limpiar selección"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dropdown flotante con resultados de la API */}
                {isDropdownOpen && !selectedProduct && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface rounded-xl border border-border shadow-lg z-30 max-h-60 overflow-y-auto divide-y divide-border/50">
                    {isSearchingProd ? (
                      <div className="p-4 flex items-center justify-center gap-2 text-ink-secondary text-xs font-medium">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>Buscando productos...</span>
                      </div>
                    ) : filteredProdOptions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-ink-secondary font-medium">
                        Sin resultados
                      </div>
                    ) : (
                      filteredProdOptions.map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => handleSelectProduct(prod)}
                          className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-[#EAF0FE] transition-colors cursor-pointer group"
                        >
                          <span className="text-xs font-semibold text-ink group-hover:text-primary transition-colors truncate max-w-[280px]">
                            {prod.nombre}
                          </span>
                          <span className="text-xs font-bold text-ink whitespace-nowrap ml-2">
                            ${prod.precio.toLocaleString("es-AR")}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Tipo de Descuento Toggle */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Tipo de Descuento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setTipo("porcentaje");
                      setValor(15);
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 ${
                      tipo === "porcentaje"
                        ? "border-primary bg-primary-tint text-primary"
                        : "border-border bg-surface text-ink-secondary hover:bg-surface-alt"
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    Porcentaje (%)
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setTipo("monto_fijo");
                      setValor(Math.min(30000, (selectedProduct?.precio ?? 100000) - 1000));
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 ${
                      tipo === "monto_fijo"
                        ? "border-primary bg-primary-tint text-primary"
                        : "border-border bg-surface text-ink-secondary hover:bg-surface-alt"
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    Monto Fijo ($)
                  </button>
                </div>
              </div>

              {/* Valor del Descuento */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Valor {tipo === "porcentaje" ? "(%)" : "(ARS $)"}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={tipo === "porcentaje" ? 99 : (selectedProduct?.precio ?? 999999) - 1}
                  disabled={isSubmitting}
                  value={valor}
                  onChange={(e) => setValor(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder={tipo === "porcentaje" ? "Ej. 20" : "Ej. 25000"}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
              </div>

              {/* Preview del Precio Final */}
              {selectedProduct && valor !== "" && (
                <div className="p-3 bg-surface-alt rounded-xl border border-border flex items-center justify-between text-xs">
                  <span className="text-ink-secondary font-medium">
                    Precio Final resultante:
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-primary text-sm">
                      $
                      {calculateFinalPrice(
                        selectedProduct.precio,
                        tipo,
                        Number(valor)
                      ).toLocaleString("es-AR")}
                    </span>
                    <span className="text-ink-secondary line-through ml-2">
                      ${selectedProduct.precio.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              )}

              {/* Fechas Inicio y Fin */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    required
                    disabled={isSubmitting}
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs text-ink focus:outline-none focus:border-primary disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    required
                    disabled={isSubmitting}
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs text-ink focus:outline-none focus:border-primary disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Switch Activo */}
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-semibold text-ink">
                  Activar oferta inmediatamente
                </span>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setActivo(!activo)}
                  className="text-primary focus:outline-none cursor-pointer disabled:opacity-50"
                >
                  {activo ? (
                    <ToggleRight className="w-8 h-8 text-primary" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-ink-secondary" />
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border bg-surface hover:bg-surface-alt text-ink rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!selectedProduct || isSubmitting}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-5 py-2 rounded-xl shadow-sm shadow-primary/30 transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    "Guardar Oferta"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar Oferta */}
      {ofertaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setOfertaToDelete(null)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-sm p-6 border border-border z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-danger">
                <Trash2 className="w-5 h-5 text-red-600 shrink-0" />
                <h3 className="text-base font-bold text-ink">
                  ¿Estás seguro que quieres eliminar esta oferta?
                </h3>
              </div>
              <button
                onClick={() => setOfertaToDelete(null)}
                className="p-1.5 text-ink-secondary hover:bg-surface-alt rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOfertaToDelete(null)}
                className="flex-1 py-2.5 border border-border bg-surface hover:bg-surface-alt text-ink rounded-xl text-sm font-bold transition-colors cursor-pointer text-center"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

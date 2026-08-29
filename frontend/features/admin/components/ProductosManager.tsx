"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  Package,
  Star,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Image as ImageIcon,
  Upload,
  Tag,
  Percent,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Categoria, Producto, SubCategoria } from "@/features/productos/types/types";
import { getCategorias, getProductos, getSubCategorias } from "@/features/productos/api/productos";
import { crearProducto, actualizarProducto, eliminarProducto } from "../api/productos";
import type { PartialProductoInput } from "../types/productos";
import { subirImagen } from "../api/upload";
import { API_URL } from "@/lib/constants";

export function ProductosManager() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<SubCategoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterStock, setFilterStock] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Producto | null>(null);
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">(0);
  const [stock, setStock] = useState<number | "">(0);
  const [categoriaId, setCategoriaId] = useState<number>(1);
  const [subcategoriaId, setSubcategoriaId] = useState<number | "">("");
  const [destacado, setDestacado] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caracteristicas, setCaracteristicas] = useState<Array<{ clave: string; valor: string }>>([
    { clave: "Garantía", valor: "12 Meses Oficial" },
  ]);

  // Carga inicial de datos de la API
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const [prodsRes, catsData, subcatsData] = await Promise.all([
          getProductos(`${API_URL}/productos?limit=100`, 0),
          getCategorias(),
          getSubCategorias(),
        ]);
        setProductos(prodsRes.data);
        setCategorias(catsData);
        setSubcategorias(subcatsData);
        if (catsData.length > 0) {
          setCategoriaId(catsData[0].id);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar los productos");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const availableSubcats = subcategorias.filter(
    (s) => s.categoria_id === categoriaId
  );

  // Filtrado reactivo en el cliente
  const filteredProductos = productos.filter((p) => {
    const term = search.toLowerCase();
    const matchesSearch =
      p.nombre.toLowerCase().includes(term) ||
      p.categoria.toLowerCase().includes(term) ||
      (p.subcategoria ? p.subcategoria.toLowerCase().includes(term) : false);

    const matchesCat =
      filterCat === "all" ||
      p.categoria.toLowerCase() === filterCat.toLowerCase();

    const matchesStock =
      filterStock === "all" ||
      (filterStock === "in_stock" && p.stock > 0) ||
      (filterStock === "low_stock" && p.stock > 0 && p.stock <= 5) ||
      (filterStock === "out_of_stock" && p.stock === 0);

    return matchesSearch && matchesCat && matchesStock;
  });

  const openCreateModal = () => {
    setEditingProd(null);
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setStock("");
    if (categorias.length > 0) {
      setCategoriaId(categorias[0].id);
    }
    setSubcategoriaId("");
    setDestacado(false);
    setImgUrl("");
    setImageFile(null);
    setImagePreview("");
    setFormError(null);
    setCaracteristicas([{ clave: "Garantía", valor: "12 Meses Oficial" }]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Producto) => {
    setEditingProd(prod);
    setNombre(prod.nombre);
    setDescripcion(prod.descripcion);
    setPrecio(prod.precio);
    setStock(prod.stock);
    const cat = categorias.find((c) => c.nombre.toLowerCase() === prod.categoria.toLowerCase());
    setCategoriaId(cat ? cat.id : (categorias[0]?.id ?? 1));
    setSubcategoriaId(prod.subcategoria_id ?? "");
    setDestacado(prod.destacado);
    setImgUrl(prod.img_url);
    setImageFile(null);
    setImagePreview(prod.img_url);
    setFormError(null);
    setCaracteristicas(
      prod.caracteristicas && prod.caracteristicas.length > 0
        ? [...prod.caracteristicas]
        : [{ clave: "Garantía", valor: "12 Meses Oficial" }]
    );
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCaracteristica = () => {
    setCaracteristicas((prev) => [...prev, { clave: "", valor: "" }]);
  };

  const handleUpdateCaracteristica = (
    index: number,
    field: "clave" | "valor",
    val: string
  ) => {
    setCaracteristicas((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  const handleRemoveCaracteristica = (index: number) => {
    setCaracteristicas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!nombre.trim() || precio === "" || stock === "" || isSubmitting) return;

    const validSpecs = caracteristicas.filter(
      (c) => c.clave.trim() !== "" && c.valor.trim() !== ""
    );

    try {
      setIsSubmitting(true);
      setFormError(null);

      let uploadedUrl = imgUrl;
      let uploadedPublicId = editingProd?.public_id || "";

      // Si subió un archivo nuevo, enviarlo primero a Cloudinary
      if (imageFile) {
        const uploadRes = await subirImagen(imageFile);
        uploadedUrl = uploadRes.url;
        uploadedPublicId = uploadRes.public_id;
      }

      if (!uploadedUrl) {
        throw new Error("Debe seleccionar una imagen para el producto");
      }

      if (editingProd) {
        const updateData: PartialProductoInput = {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          precio: Number(precio),
          stock: Number(stock),
          categoria_id: categoriaId,
          subcategoria_id: subcategoriaId ? Number(subcategoriaId) : null,
          destacado,
          img_url: uploadedUrl,
          public_id: uploadedPublicId,
        };

        const actualizado = await actualizarProducto(updateData, editingProd.id);

        setProductos((prev) =>
          prev.map((p) => (p.id === editingProd.id ? actualizado : p))
        );
      } else {
        const nuevo = await crearProducto({
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          precio: Number(precio),
          stock: Number(stock),
          categoria_id: categoriaId,
          subcategoria_id: subcategoriaId ? Number(subcategoriaId) : null,
          destacado,
          img_url: uploadedUrl,
          public_id: uploadedPublicId,
          caracteristicas: validSpecs,
        });

        setProductos((prev) => [nuevo, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al guardar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      await eliminarProducto(productToDelete.id);
      setProductos((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar el producto");
      setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            Catálogo de Productos
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Administre los productos, stock, precios e imágenes de la tienda.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-primary/30 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
          <p className="text-xs text-ink-secondary font-bold uppercase tracking-wider">Total Productos</p>
          <p className="text-2xl font-black text-ink mt-1">{productos.length}</p>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
          <p className="text-xs text-ink-secondary font-bold uppercase tracking-wider">Stock Crítico (&le;2)</p>
          <p className="text-2xl font-black text-ink mt-1">
            {productos.filter((p) => p.stock <= 2).length}
          </p>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs">
          <p className="text-xs text-ink-secondary font-bold uppercase tracking-wider">Destacados en Home</p>
          <p className="text-2xl font-black text-ink mt-1">
            {productos.filter((p) => p.destacado).length}
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
            placeholder="Buscar por nombre, categoría..."
            className="w-full pl-10 pr-3.5 py-2 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="pl-3.5 pr-8 py-2 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </select>

          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="pl-3.5 pr-8 py-2 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Todo el stock</option>
            <option value="in_stock">En stock (&gt;0)</option>
            <option value="low_stock">Stock bajo (&le;5)</option>
            <option value="out_of_stock">Sin stock (0)</option>
          </select>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Producto
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Categoría
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Precio
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary">
                  Stock
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary text-center">
                  Destacado
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-secondary text-right w-28">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-secondary">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm font-medium">Cargando catálogo de productos...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProductos.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-ink-secondary text-sm"
                  >
                    No se encontraron productos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredProductos.map((prod, idx) => (
                  <tr
                    key={prod.id}
                    className={`transition-colors hover:bg-primary-tint/40 group ${
                      idx % 2 === 1 ? "bg-surface-alt/40" : "bg-surface"
                    }`}
                  >
                    {/* Producto */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-surface-alt border border-border overflow-hidden relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prod.img_url || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60"}
                            alt={prod.nombre}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-ink leading-tight truncate">
                            {prod.nombre}
                          </p>
                          <p className="text-xs text-ink-secondary truncate mt-0.5">
                            {prod.descripcion}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categoría y Subcategoría */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-ink text-xs">
                          {prod.categoria}
                        </span>
                        {prod.subcategoria && (
                          <span className="text-[11px] text-ink-secondary">
                            {prod.subcategoria}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Precio / Oferta */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {prod.precio_oferta ? (
                          <>
                            <span className="font-extrabold text-primary">
                              ${prod.precio_oferta.toLocaleString("es-AR")}
                            </span>
                            <span className="text-xs text-ink-secondary line-through">
                              ${prod.precio.toLocaleString("es-AR")}
                            </span>
                          </>
                        ) : (
                          <span className="font-extrabold text-ink">
                            ${prod.precio.toLocaleString("es-AR")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          prod.stock === 0
                            ? "border-danger text-danger bg-transparent"
                            : prod.stock <= 5
                            ? "border-warning text-warning bg-transparent"
                            : "border-success text-success bg-transparent"
                        }`}
                      >
                        {prod.stock === 0
                          ? "Agotado (0)"
                          : prod.stock <= 5
                          ? `${prod.stock} disponibles (Bajo)`
                          : `${prod.stock} disponibles`}
                      </span>
                    </td>

                    {/* Destacado Badge */}
                    <td className="px-6 py-4 text-center">
                      {prod.destacado ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning/15 text-warning border border-warning/30">
                          <Star className="w-3 h-3 fill-warning text-warning" />
                          Sí
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-ink-secondary">
                          No
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(prod)}
                          title="Editar producto"
                          className="p-2 text-ink-secondary hover:text-primary hover:bg-primary-tint rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(prod)}
                          title="Eliminar producto"
                          className="p-2 text-ink-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 flex items-center justify-between border-t border-border bg-surface-alt/60 text-xs text-ink-secondary font-medium">
          <span>
            Mostrando {filteredProductos.length} de {productos.length} productos
          </span>
        </div>
      </div>

      {/* Modal Crear / Editar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isSubmitting && setIsModalOpen(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-2xl p-6 border border-border z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-ink">
                  {editingProd ? "Editar Producto" : "Nuevo Producto"}
                </h3>
                <p className="text-xs text-ink-secondary">
                  Complete los datos básicos, categorías, precio, imagen y especificaciones.
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

            <form onSubmit={handleSave} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Tarjeta Gráfica NVIDIA RTX 4070 SUPER"
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
              </div>

              {/* Categorías en Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Categoría *
                  </label>
                  <select
                    disabled={isSubmitting}
                    value={categoriaId}
                    onChange={(e) => {
                      setCategoriaId(Number(e.target.value));
                      setSubcategoriaId("");
                    }}
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Subcategoría
                  </label>
                  <select
                    disabled={isSubmitting || availableSubcats.length === 0}
                    value={subcategoriaId}
                    onChange={(e) => setSubcategoriaId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Ninguna / Opcional</option>
                    {availableSubcats.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Precios & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Precio (ARS $) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    disabled={isSubmitting}
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Ej. 450000"
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Stock Disponible *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    disabled={isSubmitting}
                    value={stock}
                    onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Ej. 10"
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  disabled={isSubmitting}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles del producto, especificaciones generales..."
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
              </div>

              {/* Selector y Subida de Imagen a Cloudinary */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Imagen del Producto {!editingProd && "*"}
                </label>
                <div className="flex items-center gap-4 p-3.5 border border-border rounded-xl bg-surface-alt/40">
                  <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-ink-secondary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface hover:bg-surface-alt border border-border text-ink rounded-xl text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-primary" />
                      <span>{imageFile ? "Cambiar archivo" : "Seleccionar imagen"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isSubmitting}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-ink-secondary mt-1 truncate">
                      {imageFile ? imageFile.name : "Formatos soportados: JPG, PNG, WEBP"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Destacado Toggle */}
              <div className="flex items-center gap-3 p-3 bg-surface-alt rounded-xl border border-border">
                <input
                  type="checkbox"
                  id="destacado"
                  disabled={isSubmitting}
                  checked={destacado}
                  onChange={(e) => setDestacado(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer disabled:opacity-50"
                />
                <label htmlFor="destacado" className="text-sm font-semibold text-ink cursor-pointer select-none">
                  Marcar como Producto Destacado (aparece en la Home)
                </label>
              </div>

              {/* Especificaciones Técnicas Dinámicas */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider">
                    Especificaciones Técnicas
                  </label>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleAddCaracteristica}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Agregar Fila
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {caracteristicas.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        disabled={isSubmitting}
                        placeholder="Clave (Ej. RAM)"
                        value={item.clave}
                        onChange={(e) => handleUpdateCaracteristica(index, "clave", e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-border rounded-lg bg-surface text-xs text-ink focus:outline-none focus:border-primary disabled:opacity-50"
                      />
                      <input
                        type="text"
                        disabled={isSubmitting}
                        placeholder="Valor (Ej. 16GB DDR5)"
                        value={item.valor}
                        onChange={(e) => handleUpdateCaracteristica(index, "valor", e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-border rounded-lg bg-surface text-xs text-ink focus:outline-none focus:border-primary disabled:opacity-50"
                      />
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleRemoveCaracteristica(index)}
                        className="p-1.5 text-ink-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
                  disabled={!nombre.trim() || precio === "" || stock === "" || isSubmitting}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2 rounded-xl shadow-sm shadow-primary/30 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{imageFile ? "Subiendo y guardando..." : "Guardando..."}</span>
                    </>
                  ) : (
                    "Guardar Producto"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar Producto */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setProductToDelete(null)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-sm p-6 border border-border z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-danger">
                <Trash2 className="w-5 h-5 text-red-600 shrink-0" />
                <h3 className="text-base font-bold text-ink">
                  ¿Estás seguro que quieres eliminar este producto?
                </h3>
              </div>
              <button
                onClick={() => setProductToDelete(null)}
                className="p-1.5 text-ink-secondary hover:bg-surface-alt rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-ink-secondary">
              Se eliminará <strong className="text-ink">"{productToDelete.nombre}"</strong> del catálogo.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 border border-border bg-surface hover:bg-surface-alt disabled:opacity-60 text-ink rounded-xl text-sm font-bold transition-colors cursor-pointer text-center"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-bold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

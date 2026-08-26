"use client";

import { useState } from "react";
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
  Tag,
  Percent,
} from "lucide-react";
import Image from "next/image";

interface CaracteristicaMock {
  clave: string;
  valor: string;
}

interface ProductoAdminMock {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  img_url: string;
  public_id: string;
  categoria_id: number;
  categoria_nombre: string;
  subcategoria_id: number | null;
  subcategoria_nombre: string | null;
  destacado: boolean;
  precio_oferta: number | null;
  oferta_tipo: "porcentaje" | "monto_fijo" | null;
  oferta_valor: number | null;
  caracteristicas: CaracteristicaMock[];
}

const MOCK_CATEGORIAS_SELECT = [
  { id: 1, nombre: "Procesadores (CPU)" },
  { id: 2, nombre: "Tarjetas Gráficas (GPU)" },
  { id: 3, nombre: "Placas Base (Motherboards)" },
  { id: 4, nombre: "Memorias RAM" },
  { id: 5, nombre: "Almacenamiento" },
];

const MOCK_SUBCATEGORIAS_SELECT = [
  { id: 101, categoria_id: 1, nombre: "AMD Ryzen AM5" },
  { id: 102, categoria_id: 1, nombre: "Intel Core 14th Gen" },
  { id: 201, categoria_id: 2, nombre: "NVIDIA GeForce RTX 40 Series" },
  { id: 202, categoria_id: 2, nombre: "AMD Radeon RX 7000" },
  { id: 301, categoria_id: 3, nombre: "Placas AMD B650 / X670" },
  { id: 401, categoria_id: 4, nombre: "DDR5 6000MHz+" },
  { id: 501, categoria_id: 5, nombre: "NVMe M.2 PCIe 4.0" },
];

const INITIAL_MOCK_PRODUCTOS: ProductoAdminMock[] = [
  {
    id: "f8a1c24e-b234-4e89-9a21-998812345671",
    nombre: "Placa de Video NVIDIA GeForce RTX 4060 Ti 8GB GDDR6",
    descripcion: "Tarjeta gráfica de última generación para gaming 1080p y 1440p con arquitectura Ada Lovelace y DLSS 3.",
    precio: 480000,
    stock: 12,
    img_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60",
    public_id: "ecommerce/rtx4060ti",
    categoria_id: 2,
    categoria_nombre: "Tarjetas Gráficas (GPU)",
    subcategoria_id: 201,
    subcategoria_nombre: "NVIDIA GeForce RTX 40 Series",
    destacado: true,
    precio_oferta: 408000,
    oferta_tipo: "porcentaje",
    oferta_valor: 15,
    caracteristicas: [
      { clave: "Memoria", valor: "8GB GDDR6" },
      { clave: "Bus", valor: "128-bit" },
      { clave: "Conectores", valor: "1x 8-pin" },
    ],
  },
  {
    id: "e5d2b11a-a123-4f90-8b12-887766554432",
    nombre: "Procesador AMD Ryzen 7 7800X3D 5.0GHz AM5",
    descripcion: "El mejor procesador gaming del mundo con tecnología 3D V-Cache de 104MB.",
    precio: 520000,
    stock: 8,
    img_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60",
    public_id: "ecommerce/ryzen7800x3d",
    categoria_id: 1,
    categoria_nombre: "Procesadores (CPU)",
    subcategoria_id: 101,
    subcategoria_nombre: "AMD Ryzen AM5",
    destacado: true,
    precio_oferta: 470000,
    oferta_tipo: "monto_fijo",
    oferta_valor: 50000,
    caracteristicas: [
      { clave: "Núcleos/Hilos", valor: "8 / 16" },
      { clave: "Frecuencia Turbo", valor: "5.0 GHz" },
      { clave: "Caché L3", valor: "96 MB" },
    ],
  },
  {
    id: "c3a9f00c-c456-4d12-7a98-776655443321",
    nombre: "Memoria RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
    descripcion: "Kit de memorias de alto rendimiento optimizado para AMD Expo e Intel XMP 3.0.",
    precio: 190000,
    stock: 2,
    img_url: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60",
    public_id: "ecommerce/ramcorsair",
    categoria_id: 4,
    categoria_nombre: "Memorias RAM",
    subcategoria_id: 401,
    subcategoria_nombre: "DDR5 6000MHz+",
    destacado: false,
    precio_oferta: null,
    oferta_tipo: null,
    oferta_valor: null,
    caracteristicas: [
      { clave: "Capacidad", valor: "32GB (2x16GB)" },
      { clave: "Velocidad", valor: "6000 MHz CL30" },
    ],
  },
  {
    id: "b1e8d99d-d789-4b34-6c87-665544332210",
    nombre: "Disco SSD Kingston KC3000 1TB M.2 NVMe PCIe 4.0",
    descripcion: "Unidad sólida de lectura ultra rápida hasta 7000MB/s.",
    precio: 135000,
    stock: 0,
    img_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60",
    public_id: "ecommerce/ssdkingston",
    categoria_id: 5,
    categoria_nombre: "Almacenamiento",
    subcategoria_id: 501,
    subcategoria_nombre: "NVMe M.2 PCIe 4.0",
    destacado: false,
    precio_oferta: null,
    oferta_tipo: null,
    oferta_valor: null,
    caracteristicas: [
      { clave: "Capacidad", valor: "1TB" },
      { clave: "Lectura/Escritura", valor: "7000 / 6000 MB/s" },
    ],
  },
];

export function ProductosManager() {
  const [productos, setProductos] = useState<ProductoAdminMock[]>(INITIAL_MOCK_PRODUCTOS);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterStock, setFilterStock] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<ProductoAdminMock | null>(null);

  // Form Fields
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">(0);
  const [stock, setStock] = useState<number | "">(0);
  const [categoriaId, setCategoriaId] = useState<number>(1);
  const [subcategoriaId, setSubcategoriaId] = useState<number | "">("");
  const [destacado, setDestacado] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [caracteristicas, setCaracteristicas] = useState<CaracteristicaMock[]>([
    { clave: "Garantía", valor: "12 Meses Oficial" },
  ]);

  const availableSubcats = MOCK_SUBCATEGORIAS_SELECT.filter(
    (s) => s.categoria_id === categoriaId
  );

  const filteredProductos = productos.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria_nombre.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === "all" || String(p.categoria_id) === filterCat;
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
    setCategoriaId(1);
    setSubcategoriaId("");
    setDestacado(false);
    setImgUrl("https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60");
    setCaracteristicas([{ clave: "Garantía", valor: "12 Meses" }]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: ProductoAdminMock) => {
    setEditingProd(prod);
    setNombre(prod.nombre);
    setDescripcion(prod.descripcion);
    setPrecio(prod.precio);
    setStock(prod.stock);
    setCategoriaId(prod.categoria_id);
    setSubcategoriaId(prod.subcategoria_id ?? "");
    setDestacado(prod.destacado);
    setImgUrl(prod.img_url);
    setCaracteristicas(
      prod.caracteristicas.length > 0
        ? [...prod.caracteristicas]
        : [{ clave: "Garantía", valor: "12 Meses" }]
    );
    setIsModalOpen(true);
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || precio === "" || stock === "") return;

    const catObj = MOCK_CATEGORIAS_SELECT.find((c) => c.id === categoriaId);
    const subcatObj = MOCK_SUBCATEGORIAS_SELECT.find(
      (s) => s.id === Number(subcategoriaId)
    );

    const validSpecs = caracteristicas.filter(
      (c) => c.clave.trim() !== "" && c.valor.trim() !== ""
    );

    if (editingProd) {
      // Update
      setProductos((prev) =>
        prev.map((p) =>
          p.id === editingProd.id
            ? {
                ...p,
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                precio: Number(precio),
                stock: Number(stock),
                categoria_id: categoriaId,
                categoria_nombre: catObj?.nombre || "Categoría",
                subcategoria_id: subcategoriaId ? Number(subcategoriaId) : null,
                subcategoria_nombre: subcatObj?.nombre || null,
                destacado,
                img_url: imgUrl || p.img_url,
                caracteristicas: validSpecs,
              }
            : p
        )
      );
    } else {
      // Create
      const nuevo: ProductoAdminMock = {
        id: `prod-${Date.now()}`,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        stock: Number(stock),
        img_url:
          imgUrl ||
          "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60",
        public_id: `ecommerce/prod_${Date.now()}`,
        categoria_id: categoriaId,
        categoria_nombre: catObj?.nombre || "Categoría",
        subcategoria_id: subcategoriaId ? Number(subcategoriaId) : null,
        subcategoria_nombre: subcatObj?.nombre || null,
        destacado,
        precio_oferta: null,
        oferta_tipo: null,
        oferta_valor: null,
        caracteristicas: validSpecs,
      };
      setProductos((prev) => [nuevo, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, prodNombre: string) => {
    if (!confirm(`¿Eliminar producto "${prodNombre}" del catálogo?`)) return;
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleDestacado = (id: string) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, destacado: !p.destacado } : p))
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            Catálogo de Productos
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Administre los productos, stock, precios e imágenes de la tienda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Category Filter */}
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="pl-3.5 pr-8 py-2 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            {MOCK_CATEGORIAS_SELECT.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.nombre}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
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

          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full pl-10 pr-3.5 py-2 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Primary CTA */}
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-primary/30 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary font-medium">Total Productos</p>
            <p className="text-xl font-extrabold text-ink">{productos.length}</p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-warning/15 text-warning flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary font-medium">Stock Crítico (&le;2)</p>
            <p className="text-xl font-extrabold text-ink">
              {productos.filter((p) => p.stock <= 2).length}
            </p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center font-bold">
            <Star className="w-5 h-5 fill-primary" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary font-medium">Destacados en Home</p>
            <p className="text-xl font-extrabold text-ink">
              {productos.filter((p) => p.destacado).length}
            </p>
          </div>
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
              {filteredProductos.length === 0 ? (
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
                            src={prod.img_url}
                            alt={prod.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-sm">
                          <p className="font-bold text-ink leading-tight line-clamp-1">
                            {prod.nombre}
                          </p>
                          <p className="text-xs text-ink-secondary font-mono mt-0.5">
                            #{prod.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-ink text-xs">
                          {prod.categoria_nombre}
                        </span>
                        {prod.subcategoria_nombre && (
                          <span className="text-[11px] text-ink-secondary">
                            {prod.subcategoria_nombre}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Precio */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {prod.precio_oferta ? (
                          <>
                            <span className="font-extrabold text-primary text-sm">
                              ${prod.precio_oferta.toLocaleString("es-AR")}
                            </span>
                            <span className="text-xs text-ink-secondary line-through">
                              ${prod.precio.toLocaleString("es-AR")}
                            </span>
                          </>
                        ) : (
                          <span className="font-extrabold text-ink text-sm">
                            ${prod.precio.toLocaleString("es-AR")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      {prod.stock === 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-danger/15 text-danger border border-danger/20">
                          Agotado (0)
                        </span>
                      ) : prod.stock <= 5 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-warning/15 text-warning border border-warning/20">
                          {prod.stock} un. (Bajo)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/20">
                          {prod.stock} disponibles
                        </span>
                      )}
                    </td>

                    {/* Destacado */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleDestacado(prod.id)}
                        className="p-1 text-ink-secondary hover:text-primary transition-colors focus:outline-none"
                        title={prod.destacado ? "Quitar de destacados" : "Marcar como destacado"}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            prod.destacado
                              ? "fill-warning text-warning"
                              : "text-ink-secondary/40"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(prod)}
                          title="Editar producto"
                          className="p-2 text-ink-secondary hover:text-primary hover:bg-primary-tint rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.nombre)}
                          title="Eliminar producto"
                          className="p-2 text-ink-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
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

      {/* Modal Nuevo / Editar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-2xl p-6 border border-border z-10 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-ink">
                  {editingProd ? "Editar Producto" : "Nuevo Producto"}
                </h3>
                <p className="text-xs text-ink-secondary">
                  Complete los campos para actualizar o publicar el producto en el catálogo.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-ink-secondary hover:bg-surface-alt rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Placa de Video RTX 4060 Ti 8GB"
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Categoría & Subcategoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Categoría
                  </label>
                  <select
                    value={categoriaId}
                    onChange={(e) => {
                      const newCatId = Number(e.target.value);
                      setCategoriaId(newCatId);
                      setSubcategoriaId("");
                    }}
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    {MOCK_CATEGORIAS_SELECT.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Subcategoría (Opcional)
                  </label>
                  <select
                    value={subcategoriaId}
                    onChange={(e) => setSubcategoriaId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="">Sin subcategoría</option>
                    {availableSubcats.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Precio & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Precio ($ ARS)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Ej. 450000"
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Stock Disponible
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Ej. 10"
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* URL Imagen */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  URL de Imagen (Cloudinary / Web)
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={imgUrl}
                    onChange={(e) => setImgUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
                  />
                  {imgUrl && (
                    <div className="w-10 h-10 rounded-lg border border-border overflow-hidden bg-surface-alt shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  required
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles técnicos, rendimiento y especificaciones generales..."
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Características Técnicas Dinámicas */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider">
                    Especificaciones Técnicas
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCaracteristica}
                    className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar campo
                  </button>
                </div>

                <div className="space-y-2">
                  {caracteristicas.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Clave (ej. VRAM)"
                        value={spec.clave}
                        onChange={(e) =>
                          handleUpdateCaracteristica(i, "clave", e.target.value)
                        }
                        className="w-1/3 px-3 py-1.5 text-xs border border-border rounded-lg bg-surface text-ink focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Valor (ej. 8GB GDDR6)"
                        value={spec.valor}
                        onChange={(e) =>
                          handleUpdateCaracteristica(i, "valor", e.target.value)
                        }
                        className="flex-1 px-3 py-1.5 text-xs border border-border rounded-lg bg-surface text-ink focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCaracteristica(i)}
                        className="p-1.5 text-ink-secondary hover:text-danger rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkbox Destacado */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="destacado-chk"
                  checked={destacado}
                  onChange={(e) => setDestacado(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                />
                <label
                  htmlFor="destacado-chk"
                  className="text-sm font-semibold text-ink cursor-pointer flex items-center gap-1.5"
                >
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  Marcar como Producto Destacado en la Portada
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border bg-surface hover:bg-surface-alt text-ink rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2 rounded-xl shadow-sm shadow-primary/30 transition-colors"
                >
                  {editingProd ? "Actualizar Producto" : "Publicar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  X,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Package,
} from "lucide-react";

interface OfertaMock {
  id: string;
  producto_id: string;
  producto_nombre: string;
  tipo: "porcentaje" | "monto_fijo";
  valor: number;
  precio_original: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

interface ProductoMockOption {
  id: string;
  nombre: string;
  precio: number;
}

const MOCK_PRODUCTOS_LIST: ProductoMockOption[] = [
  { id: "prod-1", nombre: "NVIDIA GeForce RTX 4060 Ti 8GB", precio: 480000 },
  { id: "prod-2", nombre: "AMD Ryzen 7 7800X3D AM5", precio: 520000 },
  { id: "prod-3", nombre: "Monitor ASUS TUF Gaming 27\" 165Hz", precio: 340000 },
  { id: "prod-4", nombre: "Memoria RAM Corsair Vengeance 32GB (2x16) DDR5", precio: 190000 },
  { id: "prod-5", nombre: "SSD Kingston KC3000 1TB NVMe PCIe 4.0", precio: 135000 },
];

const INITIAL_MOCK_OFERTAS: OfertaMock[] = [
  {
    id: "OF-001",
    producto_id: "prod-1",
    producto_nombre: "NVIDIA GeForce RTX 4060 Ti 8GB",
    tipo: "porcentaje",
    valor: 15,
    precio_original: 480000,
    fecha_inicio: "2026-08-20",
    fecha_fin: "2026-09-10",
    activo: true,
  },
  {
    id: "OF-002",
    producto_id: "prod-2",
    producto_nombre: "AMD Ryzen 7 7800X3D AM5",
    tipo: "monto_fijo",
    valor: 50000,
    precio_original: 520000,
    fecha_inicio: "2026-08-25",
    fecha_fin: "2026-09-05",
    activo: true,
  },
  {
    id: "OF-003",
    producto_id: "prod-3",
    producto_nombre: "Monitor ASUS TUF Gaming 27\" 165Hz",
    tipo: "porcentaje",
    valor: 20,
    precio_original: 340000,
    fecha_inicio: "2026-08-01",
    fecha_fin: "2026-08-20",
    activo: false,
  },
  {
    id: "OF-004",
    producto_id: "prod-5",
    producto_nombre: "SSD Kingston KC3000 1TB NVMe PCIe 4.0",
    tipo: "monto_fijo",
    valor: 20000,
    precio_original: 135000,
    fecha_inicio: "2026-08-26",
    fecha_fin: "2026-09-15",
    activo: true,
  },
];

export function OfertasManager() {
  const [ofertas, setOfertas] = useState<OfertaMock[]>(INITIAL_MOCK_OFERTAS);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [selectedProdId, setSelectedProdId] = useState(MOCK_PRODUCTOS_LIST[0].id);
  const [tipo, setTipo] = useState<"porcentaje" | "monto_fijo">("porcentaje");
  const [valor, setValor] = useState<number | "">(15);
  const [fechaInicio, setFechaInicio] = useState("2026-08-26");
  const [fechaFin, setFechaFin] = useState("2026-09-15");
  const [activo, setActivo] = useState(true);

  const calculateFinalPrice = (original: number, tipo: "porcentaje" | "monto_fijo", val: number) => {
    if (tipo === "porcentaje") {
      return original - (original * val) / 100;
    }
    return Math.max(0, original - val);
  };

  const selectedProduct = MOCK_PRODUCTOS_LIST.find((p) => p.id === selectedProdId);

  const filteredOfertas = ofertas.filter((of) => {
    const matchesSearch =
      of.producto_nombre.toLowerCase().includes(search.toLowerCase()) ||
      of.id.toLowerCase().includes(search.toLowerCase());
    const matchesTipo = filterTipo === "all" || of.tipo === filterTipo;
    const matchesEstado =
      filterEstado === "all" ||
      (filterEstado === "activas" && of.activo) ||
      (filterEstado === "inactivas" && !of.activo);

    return matchesSearch && matchesTipo && matchesEstado;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || valor === "" || Number(valor) <= 0) return;

    const nueva: OfertaMock = {
      id: `OF-${String(ofertas.length + 1).padStart(3, "0")}`,
      producto_id: selectedProduct.id,
      producto_nombre: selectedProduct.nombre,
      tipo,
      valor: Number(valor),
      precio_original: selectedProduct.precio,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      activo,
    };

    setOfertas((prev) => [nueva, ...prev]);
    setIsModalOpen(false);
  };

  const handleToggleActivo = (id: string) => {
    setOfertas((prev) =>
      prev.map((of) => (of.id === id ? { ...of, activo: !of.activo } : of))
    );
  };

  const handleDelete = (id: string) => {
    setOfertas((prev) => prev.filter((of) => of.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            Ofertas y Promociones
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Administre descuentos especiales por porcentaje o monto fijo en productos.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por producto..."
              className="w-full pl-10 pr-3.5 py-2 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-primary/30 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nueva Oferta
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-tint text-primary flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary font-medium">Total Ofertas</p>
            <p className="text-xl font-extrabold text-ink">{ofertas.length}</p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-success/15 text-success flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary font-medium">Activas Ahora</p>
            <p className="text-xl font-extrabold text-ink">
              {ofertas.filter((o) => o.activo).length}
            </p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-warning/15 text-warning flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-ink-secondary font-medium">Inactivas / Pausadas</p>
            <p className="text-xl font-extrabold text-ink">
              {ofertas.filter((o) => !o.activo).length}
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
              {filteredOfertas.length === 0 ? (
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
                  const finalPrice = calculateFinalPrice(
                    of.precio_original,
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
                        {of.id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-ink max-w-xs truncate">
                        {of.producto_nombre}
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
                          <span className="text-xs text-ink-secondary line-through">
                            ${of.precio_original.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-ink-secondary" />
                          {of.fecha_inicio} al {of.fecha_fin}
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
                          onClick={() => handleDelete(of.id)}
                          title="Eliminar oferta"
                          className="p-2 text-ink-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors focus:outline-none"
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
            onClick={() => setIsModalOpen(false)}
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
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-ink-secondary hover:bg-surface-alt rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-1">
              {/* Selector Producto */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Producto a ofertar
                </label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  {MOCK_PRODUCTOS_LIST.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} — (${p.precio.toLocaleString("es-AR")})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Descuento Toggle */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  Tipo de Descuento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTipo("porcentaje");
                      setValor(15);
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-colors ${
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
                    onClick={() => {
                      setTipo("monto_fijo");
                      setValor(30000);
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-colors ${
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
                  value={valor}
                  onChange={(e) => setValor(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder={tipo === "porcentaje" ? "Ej. 20" : "Ej. 25000"}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-surface text-sm text-ink placeholder:text-ink-secondary focus:outline-none focus:border-primary transition-colors"
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
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs text-ink focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    required
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs text-ink focus:outline-none focus:border-primary"
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
                  onClick={() => setActivo(!activo)}
                  className="text-primary focus:outline-none"
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border bg-surface hover:bg-surface-alt text-ink rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2 rounded-xl shadow-sm shadow-primary/30 transition-colors"
                >
                  Guardar Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import type { Producto } from "../../productos/types/types";
import { estaEnOferta } from "../../productos/utils/ofertaUtils";

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

const formatearPrecio = (valor: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

const MOCK_ITEMS_CARRITO: ItemCarrito[] = [
  {
    producto: {
      id: "cart-1",
      nombre: "NVIDIA GeForce RTX 4080 Super 16GB",
      descripcion: "Arquitectura Ada Lovelace con DLSS 3.5 y rendimiento masivo en 4K.",
      precio: 1549000,
      precioOferta: 1299000,
      stock: 5,
      img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWX3bfpju9Pa0yZXJIJ1Ur4ULqeO3o-YktB6dDt4NibRDy-3WA09S55UPJ-elnLyW_Z3Dv_APKww1Eeu4vP4A0A7o9f0fQ_3zEgs9F4hUJWTIVRBEMBAJp9HVoO05Ak6lX-D73idAYZ7BlvyvWOPClrcPn_CwwkqT5S28S2mdO5RrmsyH7hOIiwaIBN__g9r_rL-MRgxGyiDSDpJI2sSXnbJe2SGCjaXACvtfvK0K7hCCEwA4E4FKy",
      public_id: "rtx-4080-super",
      created_at: new Date().toISOString(),
      categoria: "Tarjetas Gráficas",
      subcategoria: "NVIDIA",
      subcategoria_id: 1,
      caracteristicas: [{ clave: "VRAM", valor: "16GB GDDR6X" }],
    },
    cantidad: 1,
  },
  {
    producto: {
      id: "cart-2",
      nombre: "AMD Ryzen 7 7800X3D Processor",
      descripcion: "El procesador de gaming más rápido del mundo con tecnología 3D V-Cache.",
      precio: 729000,
      stock: 8,
      img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD05CYnpY4aLNHH3PvEX9eVYepeuDU2KhEw2nXo0YF449Ms7eWvkJLOr-vluAmWFu3FZ1KD6doI2DESrUgPYh62QzTzhmNUGUmW0R69P_wSlGHGHZePnyN4QRh6lF1H83oniNOc06VrUpqXpTUX94lmgiNLRi8FUS0yQIptZT4HiYfSANlFeKHHuGxsLxd9dCLOR4s08L_pQx_G8nU2XAawEzpauhUZoVBvIEBdRVQwLjZyo6h_oSAN",
      public_id: "ryzen-7800x3d",
      created_at: new Date().toISOString(),
      categoria: "Procesadores",
      subcategoria: "AMD",
      subcategoria_id: 2,
      caracteristicas: [{ clave: "Núcleos", valor: "8 Cores / 16 Threads" }],
    },
    cantidad: 1,
  },
  {
    producto: {
      id: "cart-3",
      nombre: "Corsair Dominator 32GB (2x16GB) DDR5 6000MHz",
      descripcion: "Memoria RAM DDR5 ultra rápida optimizada para overclocking.",
      precio: 279000,
      stock: 10,
      img_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlOKdgRAKO7axgPLoIgkCRBAIPe6bsUaBE8vP6H9Bvv-GKDMIu_rSFc0qyF7ezSYtLOY5R6GacDs31OXReUXhA4UG-RhNp0_lQHPyACkypX7peSe8m2Peb8moXxODRAzR4vnS1UsctLGRF5z2BQv0AsqMIJc_4r7lc1Ql_c-APM9BPWmXqDZ0NUSZxKJFP45-LQW2J48oNiUfZ9AvpdpifNc7mBHIFM0Qq5suWwe6pjS1-mqSxzKwi",
      public_id: "dominator-32gb-ddr5",
      created_at: new Date().toISOString(),
      categoria: "Memorias RAM",
      subcategoria: "Corsair",
      subcategoria_id: 3,
      caracteristicas: [{ clave: "Frecuencia", valor: "6000 MT/s" }],
    },
    cantidad: 2,
  },
];

interface ProductosCarritoProps {
  items?: ItemCarrito[];
  onUpdateCantidad?: (productoId: string, nuevaCantidad: number) => void;
  onRemoveItem?: (productoId: string) => void;
}

export function ProductosCarrito({
  items: initialItems = MOCK_ITEMS_CARRITO,
  onUpdateCantidad,
  onRemoveItem,
}: ProductosCarritoProps) {
  const [items, setItems] = useState<ItemCarrito[]>(initialItems);

  const handleIncrement = (id: string, maxStock: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.producto.id === id && item.cantidad < maxStock) {
          const nuevaCantidad = item.cantidad + 1;
          if (onUpdateCantidad) onUpdateCantidad(id, nuevaCantidad);
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      })
    );
  };

  const handleDecrement = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.producto.id === id && item.cantidad > 1) {
          const nuevaCantidad = item.cantidad - 1;
          if (onUpdateCantidad) onUpdateCantidad(id, nuevaCantidad);
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      })
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.producto.id !== id));
    if (onRemoveItem) onRemoveItem(id);
  };

  if (items.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary-tint flex items-center justify-center text-primary mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-ink">Tu carrito está vacío</h3>
        <p className="text-sm text-ink-secondary max-w-sm mx-auto">
          Explora nuestro catálogo y agrega los mejores componentes para tu PC.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xs">
      {/* Table Header (Desktop Only) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 sm:px-5 py-4 bg-surface-alt/70 border-b border-border font-extrabold text-xs text-ink-secondary uppercase tracking-wider items-center">
        <div className="col-span-6 pl-1">Producto</div>
        <div className="col-span-2 text-center">Precio</div>
        <div className="col-span-2 text-center">Cantidad</div>
        <div className="col-span-2 text-right">Subtotal</div>
      </div>

      {/* Cart Items List */}
      <div className="divide-y divide-border/50">
        {items.map(({ producto, cantidad }) => {
          const enOferta = estaEnOferta(producto);
          const precioUnitario = enOferta ? producto.precioOferta! : producto.precio;
          const descuento = enOferta ? producto.precio - producto.precioOferta! : 0;
          const subtotal = precioUnitario * cantidad;

          return (
            <div
              key={producto.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 sm:p-5 items-center hover:bg-surface-alt/30 transition-colors"
            >
              {/* Producto Info (Imagen + Nombre + Categoría) */}
              <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                <Link
                  href={`/productos/${producto.id}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-surface-alt/50 border border-border rounded-xl p-2 flex items-center justify-center overflow-hidden hover:border-primary transition-all cursor-pointer group"
                >
                  <img
                    src={producto.img_url}
                    alt={producto.nombre}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-secondary/80">
                      {producto.subcategoria || producto.categoria}
                    </span>
                    {enOferta && (
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        Descuento de {formatearPrecio(descuento)}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/productos/${producto.id}`}
                    className="font-bold text-sm sm:text-base text-ink line-clamp-2 leading-snug hover:text-primary transition-colors cursor-pointer"
                  >
                    {producto.nombre}
                  </Link>
                  <button
                    onClick={() => handleRemove(producto.id)}
                    className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-700 transition-colors w-fit mt-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>

              {/* Precio */}
              <div className="col-span-4 md:col-span-2 flex flex-col items-center justify-center text-center">
                <span className="md:hidden text-ink-secondary font-semibold text-[11px] mb-0.5">Precio:</span>
                {enOferta ? (
                  <div className="flex flex-col items-center justify-center leading-tight text-center">
                    <span className="text-[11px] text-ink-secondary/70 line-through font-normal">
                      {formatearPrecio(producto.precio)}
                    </span>
                    <span className="text-primary font-black text-sm sm:text-base">
                      {formatearPrecio(producto.precioOferta!)}
                    </span>
                  </div>
                ) : (
                  <span className="font-black text-sm sm:text-base text-ink">
                    {formatearPrecio(producto.precio)}
                  </span>
                )}
              </div>

              {/* Selector de Cantidad */}
              <div className="col-span-4 md:col-span-2 flex justify-start md:justify-center items-center">
                <div className="flex items-center border border-border rounded-xl bg-surface-alt/50 overflow-hidden">
                  <button
                    onClick={() => handleDecrement(producto.id)}
                    disabled={cantidad <= 1}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-surface text-ink disabled:opacity-30 transition-colors cursor-pointer"
                    aria-label="Disminuir"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 sm:w-10 text-center font-extrabold text-xs sm:text-sm text-ink">
                    {cantidad}
                  </span>
                  <button
                    onClick={() => handleIncrement(producto.id, producto.stock)}
                    disabled={cantidad >= producto.stock}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-surface text-ink disabled:opacity-30 transition-colors cursor-pointer"
                    aria-label="Aumentar"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="col-span-4 md:col-span-2 flex md:justify-end items-center font-extrabold text-sm sm:text-base text-primary">
                <span className="md:hidden text-ink-secondary font-semibold mr-1 text-xs">
                  Subtotal:
                </span>
                {formatearPrecio(subtotal)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductosCarrito;

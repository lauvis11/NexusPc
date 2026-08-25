"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCarritoStore } from "../store/store";
import { formatearPrecio } from "@/shared/utils/format";

export function ProductosCarrito() {
  const { items, actualizarCantidad, eliminarProducto, limpiarCarrito } = useCarritoStore();

  if (items.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-primary-tint flex items-center justify-center text-primary mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-ink">Tu carrito está vacío</h3>
        <p className="text-sm text-ink-secondary max-w-sm mx-auto">
          Explora nuestro catálogo y agrega los mejores componentes para tu PC gamer.
        </p>
        <Link
          href="/productos"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-surface font-bold text-sm rounded-xl hover:bg-primary-hover active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          Ver Productos
        </Link>
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
        {items.map((item) => {
          const precioBase = Number(item.precio);
          const precioOferta = item.precio_oferta != null ? Number(item.precio_oferta) : null;
          const enOferta = precioOferta != null && precioOferta < precioBase;
          const precioEfectivo = enOferta ? precioOferta : precioBase;
          const descuento = enOferta ? precioBase - precioOferta : 0;
          const subtotal = precioEfectivo * item.cantidad;

          return (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 sm:p-5 items-center hover:bg-surface-alt/30 transition-colors"
            >
              {/* Producto Info (Imagen + Nombre + Eliminar) */}
              <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                <Link
                  href={`/productos/${item.id}`}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-surface-alt/50 border border-border rounded-xl p-2 flex items-center justify-center overflow-hidden hover:border-primary transition-all cursor-pointer group"
                >
                  <Image
                    src={item.img_url || "/placeholder-product.png"}
                    alt={item.nombre}
                    fill
                    sizes="96px"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                  />
                </Link>

                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  {enOferta && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        Ahorrás {formatearPrecio(descuento)}
                      </span>
                    </div>
                  )}

                  <Link
                    href={`/productos/${item.id}`}
                    className="font-bold text-sm sm:text-base text-ink line-clamp-2 leading-snug hover:text-primary transition-colors cursor-pointer"
                  >
                    {item.nombre}
                  </Link>

                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-ink-secondary">
                      Stock: <strong className="text-ink font-semibold">{item.stock}</strong>
                    </span>

                    <button
                      onClick={() => eliminarProducto(item.id)}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                      aria-label={`Eliminar ${item.nombre}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Precio Unitario */}
              <div className="col-span-4 md:col-span-2 flex flex-col items-start md:items-center justify-center text-left md:text-center">
                <span className="md:hidden text-ink-secondary font-semibold text-[11px] mb-0.5">Precio:</span>
                {enOferta ? (
                  <div className="flex flex-col md:items-center leading-tight">
                    <span className="text-[11px] text-ink-secondary/70 line-through font-normal">
                      {formatearPrecio(precioBase)}
                    </span>
                    <span className="text-primary font-black text-sm sm:text-base">
                      {formatearPrecio(precioOferta)}
                    </span>
                  </div>
                ) : (
                  <span className="font-black text-sm sm:text-base text-ink">
                    {formatearPrecio(precioBase)}
                  </span>
                )}
              </div>

              {/* Selector de Cantidad */}
              <div className="col-span-4 md:col-span-2 flex justify-start md:justify-center items-center">
                <div className="flex items-center border border-border rounded-xl bg-surface-alt/50 overflow-hidden shadow-2xs">
                  <button
                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    disabled={item.cantidad <= 1}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-surface text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 sm:w-10 text-center font-extrabold text-xs sm:text-sm text-ink select-none">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                    disabled={item.cantidad >= item.stock}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-surface text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Aumentar cantidad"
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

      {/* Footer con Vaciar Carrito */}
      <div className="p-4 bg-surface-alt/40 border-t border-border flex justify-between items-center text-xs text-ink-secondary">
        <span>{items.length} {items.length === 1 ? "producto diferente" : "productos diferentes"}</span>
        <button
          onClick={limpiarCarrito}
          className="text-red-500 hover:text-red-700 hover:underline font-semibold transition-colors cursor-pointer"
        >
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}

export default ProductosCarrito;

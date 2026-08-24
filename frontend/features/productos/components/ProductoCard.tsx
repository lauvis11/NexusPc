"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Producto } from "../types/types";
import { estaEnOferta, calcularDescuento } from "../utils/ofertaUtils";
import { useCarritoStore } from "@/features/carrito/store/store";
import { formatearPrecio } from "@/shared/utils/format";

interface ProductoCardProps {
  producto: Producto;
  onAddToCart?: (producto: Producto) => void;
}

export function ProductoCard({ producto, onAddToCart }: ProductoCardProps) {
  const agregarProducto = useCarritoStore((state) => state.agregarProducto);

  const enOferta = estaEnOferta(producto);
  const pctDescuento = enOferta
    ? calcularDescuento(producto.precio, producto.precio_oferta!)
    : 0;

  // Obtener marca en mayúsculas (subcategoría o primera palabra del nombre)
  const marca = (
    producto.subcategoria ||
    producto.nombre.split(" ")[0] ||
    "NEXUS"
  ).toUpperCase();

  return (
    <Link
      href={`/productos/${producto.id}`}
      className="group bg-surface border border-border p-3 sm:p-5 rounded-xl sm:rounded-2xl hover:shadow-xl hover:border-primary/30 transition-all flex flex-col h-full relative cursor-pointer select-none"
    >
      {/* Badge de Oferta sobre la imagen */}
      {enOferta && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex items-center gap-1">
          <span className="bg-primary text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shadow-md">
            -{pctDescuento}%
          </span>
        </div>
      )}

      {/* Contenedor de Imagen */}
      <div className="relative mb-2.5 sm:mb-3.5 h-36 sm:h-56 w-full flex items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-surface-alt/50 overflow-hidden shrink-0">
        <img
          src={producto.img_url || "/placeholder-product.png"}
          alt={producto.nombre}
          className="max-h-full max-w-full object-contain pointer-events-none"
        />
      </div>

      {/* Marca en Mayúsculas */}
      <span className="text-[9px] sm:text-[11px] font-extrabold text-ink-secondary/80 uppercase tracking-widest mb-0.5 sm:mb-1 block">
        {marca}
      </span>

      {/* Título */}
      <h3 className="font-bold text-ink text-xs sm:text-base line-clamp-2 h-8 sm:h-11 leading-snug group-hover:text-primary transition-colors mb-2 sm:mb-4">
        {producto.nombre}
      </h3>

      {/* Sección Inferior: Precio y Acciones */}
      <div className="mt-auto space-y-2 sm:space-y-3 pt-1">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex flex-col min-w-0">
            {enOferta ? (
              <>
                {/* Precio original tachado */}
                <span className="text-[10px] sm:text-xs text-ink-secondary/80 line-through leading-none mb-1">
                  {formatearPrecio(producto.precio)}
                </span>
                {/* Precio de oferta destacado */}
                <span className="text-xs sm:text-lg font-extrabold text-primary tracking-tight truncate">
                  {formatearPrecio(producto.precio_oferta!)}
                </span>
                <span className="text-[8px] sm:text-[10px] text-ink-secondary/70 uppercase font-semibold tracking-wider mt-0.5">
                  Precio oferta
                </span>
              </>
            ) : (
              <>
                <span className="text-xs sm:text-lg font-extrabold text-ink tracking-tight truncate">
                  {formatearPrecio(producto.precio)}
                </span>
                <span className="text-[8px] sm:text-[10px] text-ink-secondary/70 uppercase font-semibold tracking-wider mt-0.5">
                  Precio contado
                </span>
              </>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              agregarProducto(producto, 1);
              onAddToCart && onAddToCart(producto);
            }}
            aria-label={`Agregar ${producto.nombre} al carrito`}
            className="w-8 h-8 sm:w-11 sm:h-11 bg-primary text-surface rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer relative z-20"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <span className="w-full py-1.5 sm:py-2.5 px-2 sm:px-4 border border-border rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold text-ink-secondary group-hover:bg-primary group-hover:text-surface group-hover:border-primary transition-all text-center block">
          Ver más
        </span>
      </div>
    </Link>
  );
}

export default ProductoCard;

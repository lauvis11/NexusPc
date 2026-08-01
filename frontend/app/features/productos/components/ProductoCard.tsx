"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Producto } from "../types/types";
import { estaEnOferta, calcularDescuento } from "../utils/ofertaUtils";

interface ProductoCardProps {
  producto: Producto;
  onAddToCart?: (producto: Producto) => void;
}

const formatearPrecio = (valor: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

export function ProductoCard({ producto, onAddToCart }: ProductoCardProps) {
  const enOferta = estaEnOferta(producto);
  const descuento = enOferta
    ? producto.precio - producto.precioOferta!
    : 0;

  // Obtener marca en mayúsculas (subcategoría o primera palabra del nombre)
  const marca = (
    producto.subcategoria ||
    producto.nombre.split(" ")[0] ||
    "NEXUS"
  ).toUpperCase();

  return (
    <div className="group bg-surface border border-border p-5 rounded-2xl hover:shadow-xl hover:border-primary/30 transition-all flex flex-col h-full relative cursor-pointer">
      {/* Badge de Oferta sobre la imagen */}
      {enOferta && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1">
          <span className="bg-primary text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
            Ahorras {formatearPrecio(descuento)}
          </span>
        </div>
      )}

      {/* Contenedor de Imagen */}
      <div className="relative mb-3.5 h-52 sm:h-56 w-full flex items-center justify-center p-3 rounded-xl bg-surface-alt/50 overflow-hidden">
        <img
          src={producto.img_url || "/placeholder-product.png"}
          alt={producto.nombre}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Marca en Mayúsculas */}
      <span className="text-[10px] sm:text-[11px] font-extrabold text-ink-secondary/80 uppercase tracking-widest mb-1 block">
        {marca}
      </span>

      {/* Título */}
      <h3 className="font-bold text-ink text-sm sm:text-base line-clamp-2 h-10 sm:h-11 leading-snug group-hover:text-primary transition-colors mb-4">
        {producto.nombre}
      </h3>

      {/* Sección Inferior: Precio y Acciones */}
      <div className="mt-auto space-y-3 pt-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {enOferta ? (
              <>
                {/* Precio original tachado */}
                <span className="text-xs text-ink-secondary/80 line-through leading-none mb-2">
                  {formatearPrecio(producto.precio)}
                </span>
                {/* Precio de oferta destacado */}
                <span className="text-base sm:text-lg font-extrabold text-primary tracking-tight">
                  {formatearPrecio(producto.precioOferta!)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-ink-secondary/70 uppercase font-semibold tracking-wider mt-0.5">
                  Precio oferta
                </span>
              </>
            ) : (
              <>
                <span className="text-base sm:text-lg font-extrabold text-ink tracking-tight">
                  {formatearPrecio(producto.precio)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-ink-secondary/70 uppercase font-semibold tracking-wider mt-0.5">
                  Precio contado
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => onAddToCart && onAddToCart(producto)}
            aria-label={`Agregar ${producto.nombre} al carrito`}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-primary text-surface rounded-xl flex items-center justify-center hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        <Link
          href={`/productos/${producto.id}`}
          className="w-full py-2.5 px-4 border border-border rounded-xl text-xs font-semibold text-ink-secondary group-hover:bg-primary group-hover:text-surface group-hover:border-primary transition-all text-center block"
        >
          Ver más
        </Link>
      </div>
    </div>
  );
}

export default ProductoCard;

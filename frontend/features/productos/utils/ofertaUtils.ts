import type { Producto } from "../types/types";

/**
 * Devuelve true si el producto tiene un precio de oferta válido
 * (precio_oferta existe, no es null, y es menor al precio base).
 * Convierte a Number para evitar problemas de tipos de PostgreSQL (string decimal).
 */
export function estaEnOferta(producto: Producto): boolean {
  if (!producto) return false;
  const precio = Number(producto.precio);
  const precioOferta = producto.precio_oferta != null ? Number(producto.precio_oferta) : null;
  return (
    precioOferta != null &&
    !isNaN(precioOferta) &&
    !isNaN(precio) &&
    precioOferta < precio
  );
}

/**
 * Calcula el porcentaje de descuento redondeado a entero.
 * Ejemplo: precio=1000, precioOferta=800 → 20
 */
export function calcularDescuento(precio: number | string, precioOferta: number | string): number {
  const p = Number(precio);
  const po = Number(precioOferta);
  if (isNaN(p) || isNaN(po) || p === 0) return 0;
  return Math.round(((p - po) / p) * 100);
}

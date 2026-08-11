import type { Producto } from "../types/types";

/**
 * Devuelve true si el producto tiene un precio de oferta válido
 * (precioOferta existe, no es null, y es menor al precio base).
 */
export function estaEnOferta(producto: Producto): boolean {
  return (
    producto.precio_oferta != null &&
    producto.precio_oferta < producto.precio
  );
}

/**
 * Calcula el porcentaje de descuento redondeado a entero.
 * Ejemplo: precio=1000, precioOferta=800 → 20
 */
export function calcularDescuento(precio: number, precioOferta: number): number {
  return Math.round(((precio - precioOferta) / precio) * 100);
}

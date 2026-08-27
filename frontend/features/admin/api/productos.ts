import { API_URL } from "@/lib/constants";
import type { ProductoInput } from "../types/productos";
import type { Producto } from "@/features/productos/types/types";

export async function crearProducto(data: ProductoInput): Promise<Producto> {
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al crear el producto");
  }

  return response.json();
}
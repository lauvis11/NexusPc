import { API_URL } from "@/lib/constants";
import type { Orden, OrdenInput } from "../types/ordenes";

export async function crearOrden(data: OrdenInput): Promise<Orden> {
  const response = await fetch(`${API_URL}/ordenes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if(!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear la orden")
  }

  return response.json();
}

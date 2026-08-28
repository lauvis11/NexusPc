import { Orden } from "@/features/ordenes/types/ordenes";
import { API_URL } from "@/lib/constants";

export async function obtenerOrdenes(): Promise<Orden[]>{
    const response = await fetch(`${API_URL}/ordenes`, {
        credentials: 'include'
    })

    if(!response.ok){
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "Error al obtener las ordenes")
    }

    return response.json()
}
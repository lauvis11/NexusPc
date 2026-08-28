import { EstadoOrden, Orden } from "@/features/ordenes/types/ordenes";
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

export async function actualizarEstadoOrden(id: string, estado: EstadoOrden): Promise<Orden>{
    const response = await fetch(`${API_URL}/ordenes/${id}/estado`, {
        credentials: 'include',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado })
    })

    if(!response.ok){
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "Error al actualizar el estado de la orden")
    }

    return response.json()
}
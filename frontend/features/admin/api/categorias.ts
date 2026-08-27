import { Categoria } from "@/features/productos/types/types";
import { API_URL } from "@/lib/constants";

export async function crearCategoria(data: {nombre: string}): Promise<Categoria>{
    const response = await fetch(`${API_URL}/categorias`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if(!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "Error al crear la categoria")
    }

    return response.json()
}

export async function eliminarCategoria(id: string): Promise<void>{
    const response = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })

    if(!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "Error al eliminar la categoria")
    }
}
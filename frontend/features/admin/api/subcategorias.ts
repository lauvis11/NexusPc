import { API_URL } from "@/lib/constants";
import { SubcategoriaInput } from "../types/subcategorias";
import { SubCategoria } from "@/features/productos/types/types";

export async function crearSubcategoria(data: SubcategoriaInput): Promise<SubCategoria>  {
    const response = await fetch(`${API_URL}/subcategorias`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if(!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al crear la subcategoria')
    }

    return response.json()
}
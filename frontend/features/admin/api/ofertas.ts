import { API_URL } from "@/lib/constants";
import { Oferta, OfertasInput, PartialOfertaInput } from "../types/ofertas";

export async function crearOferta(data: OfertasInput): Promise<Oferta> {
    const response = await fetch(`${API_URL}/ofertas`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "Error al crear la oferta")
    }

    return response.json()
}

export async function actualizarOferta(id: number, data: PartialOfertaInput): Promise<Oferta>{
    const response = await fetch(`${API_URL}/ofertas/${id}`,{
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify(data)
    })

    if(!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "Error al actualizar la oferta")
    }

    return response.json()

}



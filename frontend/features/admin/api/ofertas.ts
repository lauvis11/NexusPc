import { API_URL } from "@/lib/constants";
import { Oferta, OfertasInput } from "../types/ofertas";

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
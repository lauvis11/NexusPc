import type { Producto, ProductosResponse } from "../types/types"

export async function getProductos(url: string, revalidate: number): Promise<ProductosResponse> {
    const res = await fetch(url, { next: { revalidate: revalidate } })
    if (!res.ok) throw new Error('Error al obtener los productos')
    const productos: ProductosResponse = await res.json()
    return productos
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getProductoIndividual(id: string): Promise<Producto | null> {
    try {
        const url = `${API_URL}/productos/${id}`
        const res = await fetch(url, {
            next: { revalidate: 60, tags: [`producto-${id}`] }
        })
        if (!res.ok) return null
        const producto: Producto = await res.json()
        return producto
    } catch {
        return null
    }
}


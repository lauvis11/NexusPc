import type { Categoria, Producto, ProductosResponse, SubCategoria } from "../types/types"
import { API_URL } from "@/lib/constants";

export async function getProductos(url: string, revalidate: number): Promise<ProductosResponse> {
    const res = await fetch(url, { next: { revalidate: revalidate } })
    if (!res.ok) throw new Error('Error al obtener los productos')
    const productos: ProductosResponse = await res.json()
    return productos
}

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

export async function getCategorias(): Promise<Categoria[]> {
    const res = await fetch(`${API_URL}/categorias`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error('Error al obtener las categorias')
    const data = await res.json()
    return data.categorias ?? data
}

export async function getSubCategorias(): Promise<SubCategoria[]> {
    const res = await fetch(`${API_URL}/subcategorias`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error('Error al obtener las subcategorias')
    const data = await res.json()
    return data.value ?? data
}


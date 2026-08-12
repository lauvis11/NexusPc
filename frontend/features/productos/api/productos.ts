import type { Producto, ProductosResponse } from "../types/types"

export async function getProductos(url: string, revalidate: number): Promise<ProductosResponse> {
    const res = await fetch(url, { next: { revalidate: revalidate } })
    if (!res.ok) throw new Error('Error al obtener los productos')
    const productos: ProductosResponse = await res.json()
    return productos
}

export async function getProductoIndividual(id: string): Promise<Producto> {
    const url = `${process.env.NEXT_API_URL}/api/v1/productos/${id}`
    const res = await fetch(url, {
        next: {tags: [`producto-${id}`]}
    })
    if(!res.ok) throw new Error('Error al obtener el producto')
    const producto: Producto = await res.json()
    return producto
}


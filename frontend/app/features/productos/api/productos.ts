import type { ProductosResponse } from "../types/types"

export async function getProductos(url: string, revalidate: number): Promise<ProductosResponse>{
    try{
        const res = await fetch(url, { next: { revalidate: revalidate } })
        if(!res.ok) throw new Error('Error al obtener los productos')
        const productos: ProductosResponse = await res.json()
        return productos
    }catch{
        return {data: [], pagination: {total: 0, page: 1, limit: 10, totalPages: 0}}
    }
} 


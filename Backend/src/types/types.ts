import type { CaracteristicaProducto } from "../schemas/productos.js"

export interface Producto{
    id: string
    nombre: string
    descripcion: string
    precio: number
    stock: number
    img_url: string
    public_id: string
    created_at: Date
    categoria_id: number
    caracteristicas: CaracteristicaProducto[]
}

export interface Categoria{
    id: number, 
    nombre: string
}
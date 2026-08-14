import { Producto } from "@/features/productos/types/types"

export interface CarritoItem{
    id: string
    nombre: string
    precio: number
    precio_oferta: number | null
    img_url: string
    stock: number
    cantidad: number
}

export interface CarritoContextType {
    items: CarritoItem[]
    agregarProducto: (producto: Producto, cantidad: number) => void
    eliminarProducto: (id: string) => void
    actualizarCantidad: (id: string, cantidad: number) => void
    limpiarCarrito: () => void
    total: number
    totalItems: number
}
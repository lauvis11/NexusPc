export interface Producto{
    id: string         
    nombre: string
    descripcion: string
    precio: number
    stock: number
    img_url: string
    public_id: string
    created_at: string
    categoria: string    
    subcategoria: string | null
    subcategoria_id: number | null
    caracteristicas: Array<{
        clave: string
        valor: string
    }>
}

export interface ProductosResponse{
    data: Producto[]
    pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    }
}
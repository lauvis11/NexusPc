export interface Usuario{
    id: number
    nombre: string
    email: string
    rol?: "ADMIN" | "CLIENTE" | string
    created_at: string
    nombre_completo: string | null
    dni: string | null
    direccion: string | null
    ciudad: string | null
    provincia: string | null
    codigo_postal: string | null
}

export interface AuthContextType{
    user: Usuario | null
    isLoading: boolean
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}
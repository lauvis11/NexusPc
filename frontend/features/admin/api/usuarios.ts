import { Usuario } from "@/features/auth/types/auth";
import { API_URL } from "@/lib/constants";

export async function obtenerUsuarios(): Promise<Usuario[]>{
    const response = await fetch(`${API_URL}/usuarios`, {
        credentials: 'include'
    })

    if(!response.ok){
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || 'Error al obtener usuarios')
    }
    return response.json()
}

export async function eliminarUsuario(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al eliminar usuario');
    }
}
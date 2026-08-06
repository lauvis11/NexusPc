import { Usuario } from "@/features/auth/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPerfil(): Promise<Usuario | null> {
    const response = await fetch(`${API_URL}/usuarios/perfil`, {
        credentials: "include"
    })
    if (!response.ok) return null
    return response.json();
}
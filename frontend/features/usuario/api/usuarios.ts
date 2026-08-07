import { Usuario } from "@/features/auth/types/auth";
import { DatosFacturacion } from "../types/usuarios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPerfil(): Promise<Usuario | null> {
    const response = await fetch(`${API_URL}/usuarios/perfil`, {
        credentials: "include"
    })
    if (!response.ok) return null
    return response.json();
}

export async function crearDatosFacturacion(formData: DatosFacturacion){
    const response = await fetch(`${API_URL}/usuarios/datos-facturacion`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message)
    }
    return response.json()
}

export async function actualizarDatos(formData: Partial<DatosFacturacion>){
    const response = await fetch(`${API_URL}/usuarios/datos-facturacion`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message)
    }
    return response.json()
}
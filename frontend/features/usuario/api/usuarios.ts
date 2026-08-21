import { Usuario } from "@/features/auth/types/auth";
import { ContraseñasForm, DatosFacturacion } from "../types/usuarios";
import { API_URL } from "@/lib/constants";

export async function getPerfil(): Promise<Usuario | null> {
    try {
        const response = await fetch(`${API_URL}/usuarios/perfil`, {
            credentials: "include"
        })
        if (!response.ok) return null
        return response.json();
    } catch {
        return null;
    }
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
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Error al guardar datos de facturación")
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
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Error al actualizar datos de facturación")
    }
    return response.json()
}

export async function cambiarContraseña(data: ContraseñasForm){
    const response = await fetch(`${API_URL}/usuarios/update-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: data.contraseña_actual,
            newPassword: data.nueva_contraseña
        })
    })
    if(!response.ok){
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Error al actualizar contraseña")
    }
    return response.json()
}
import { LoginInput, RegisterInput } from "@/features/usuarios/schemas/auth.schema"

const API_URL = process.env.NEXT_API_URL

export async function login(data: LoginInput){
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }

    const result = await response.json()
    return result
}

export async function register(data: RegisterInput){
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    if(!response.ok){
        const error = await response.json()
        throw new Error(error.message)
    }

    const result = await response.json()
    return result
}

export async function logout(){
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    })
    if(!response.ok){
        const error = await response.json()
        throw new Error(error.message)
    }
     
    const result = await response.json()
    return result
}
import { LoginInput } from "@/features/usuarios/schemas/auth.schema"

const API_URL = process.env.NEXT_API_URL

export async function login(data: LoginInput){
    try{
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(!response.ok) {
            const error = await response.json()
            throw new Error(error.message)
        }

        const result = await response.json()
        return result
    }catch(error){
        console.log(error)
        return null
    }
}
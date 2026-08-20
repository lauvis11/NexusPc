"use client";
import { useRouter } from "next/navigation";
import { logout as logoutApi } from "../api/auth";
import { getPerfil } from "@/features/usuario/api/usuarios";
import { AuthContextType, Usuario } from "../types/auth";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: React.ReactNode}){
    const [user, setUser] = useState<Usuario | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    
    async function refreshUser(){
        try {
            const data = await getPerfil()
            setUser(data)
        } catch {
            setUser(null)
        }
    }

    useEffect(() => {
        async function verifySession(){
            try {
                const data = await getPerfil()
                setUser(data)
            } catch {
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }
        verifySession()
    }, [])

    async function logout(){
        try {
            await logoutApi()
        } catch {
            // Ignorar error de red en logout
        } finally {
            setUser(null)
            router.push('/')
        }
    }

    return (
        <AuthContext.Provider value={{user, isLoading, logout, refreshUser}}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth() {
    const context = useContext(AuthContext)
    if(!context) throw new Error('useAuth debe estar dentro del AuthProvider')
    return context
}
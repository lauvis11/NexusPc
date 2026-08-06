import { useRouter } from "next/navigation";
import { getPerfil, logout as logoutApi } from "../api/auth";
import { AuthContextType, Usuario } from "../types/auth";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children: React.ReactNode}){
    const [user, setUser] = useState<Usuario | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    
    useEffect(() => {
        async function verifySession(){
            const data = await getPerfil()
            setUser(data)
            setIsLoading(false)
        }
        verifySession()
    }, [])

    async function logout(){
        await logoutApi()
        setUser(null)
        router.push('/')
    }

    return <AuthContext.Provider value={{user, isLoading, logout}}>{children}</AuthContext.Provider>

}

export function useAuth() {
    const context = useContext(AuthContext)
    if(!context) throw new Error('useAuth debe estar dentro del AuthProvider')
    return context
}
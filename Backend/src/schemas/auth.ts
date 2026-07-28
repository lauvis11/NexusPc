import z from "zod"

const registerSchema = z.object({
    nombre: z.string().min(3),
    email: z.email(),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(50).regex(/[0-9]/, 'La contraseña debe contener al menos un número') 
}) 

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(50) 
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

export function ValidateRegister(input: unknown){
    return registerSchema.safeParse(input)
}

export function ValidateLogin(input: unknown){
    return loginSchema.safeParse(input)
}
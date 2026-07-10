import z from "zod"

const registerSchema = z.object({
    nombre: z.string().min(3),
    email: z.email(),
    password: z.string().min(6).max(50) 
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
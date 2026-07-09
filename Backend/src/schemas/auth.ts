import z from "zod"

const registerSchema = z.object({
    nombre: z.string().min(3),
    email: z.email(),
    password: z.string().min(6).max(50) 
}) 

export type RegisterInput = z.infer<typeof registerSchema>

export function ValidateRegister(input: unknown){
    return registerSchema.safeParse(input)
}
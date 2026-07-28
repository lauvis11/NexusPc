import z from "zod"

const newPasswordSchema = z.object({
    password: z.string().min(6).max(50),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres').max(50).regex(/[0-9]/, 'La nueva contraseña debe contener al menos un número')
})

export function ValidateNewPassword(input: unknown){
    return newPasswordSchema.safeParse(input)
}
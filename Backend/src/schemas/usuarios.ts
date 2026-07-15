import z from "zod"

const newPasswordSchema = z.object({
    password: z.string().min(6).max(50),
    newPassword: z.string().min(6).max(50)
})

export function ValidateNewPassword(input: unknown){
    return newPasswordSchema.safeParse(input)
}
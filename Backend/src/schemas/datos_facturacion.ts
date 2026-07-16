import z from "zod"

const facturacionSchema = z.object({
    nombre_completo: z.string().min(3),
    dni: z.string().min(7).max(8),
    direccion: z.string().min(5),
    ciudad: z.string().min(2),
    provincia: z.string().min(2),
    codigo_postal: z.string().min(4)
})

const updateFacturacionSchema = facturacionSchema.omit({dni: true})

export type FacturacionInput = z.infer<typeof facturacionSchema>
export type UpdateFacturacionInput = z.infer<typeof updateFacturacionSchema>

export function ValidateFacturacion(input: unknown){
    return facturacionSchema.safeParse(input)
}

export function ValidatePartialFacturacion(input: unknown){
    return updateFacturacionSchema.partial().safeParse(input)
}
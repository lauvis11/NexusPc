import z from 'zod'

const subcategoriaSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    categoria_id: z.number().int().positive('El id de categoría debe ser un número positivo')
})

export type SubcategoriaInput = z.infer<typeof subcategoriaSchema>

export function ValidateSubcategoria(input: unknown){
    return subcategoriaSchema.safeParse(input)
}

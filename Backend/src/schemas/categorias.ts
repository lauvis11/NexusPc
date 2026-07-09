import z from 'zod'

const categoriaSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres')
})

export type CategoriaInput = z.infer<typeof categoriaSchema>

export function ValidateCategoria(input: unknown){
    return categoriaSchema.safeParse(input)
}
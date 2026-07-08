import z from 'zod'

const categoriaSchema = z.object({
    nombre: z.string().min(1)
})

export type CategoriaInput = z.infer<typeof categoriaSchema>

export function ValidateCategoria(input: unknown){
    return categoriaSchema.safeParse(input)
}
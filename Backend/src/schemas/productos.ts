import z from 'zod'

const idSchema = z.uuid()
export function ValidateId(input: string){
    return idSchema.safeParse(input)
}

const caracteristicaSchema = z.object({
    clave: z.string().min(1),
    valor: z.string().min(1)
})
const productoSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    precio: z.number().positive('El precio debe ser mayor a 0'),
    stock: z.number().int().min(0, 'El stock no puede ser negativo'),
    img_url: z.string().url('La URL de la imagen no es válida'),
    public_id: z.string(),
    categoria_id: z.number().int().positive(),
    caracteristicas: z.array(caracteristicaSchema).min(1, 'Debe tener al menos una característica')
})

export type CaracteristicaProducto = z.infer<typeof caracteristicaSchema>
export type ProductoNuevo = z.infer<typeof productoSchema>

export function ValidateProducto(input: unknown){
    return productoSchema.safeParse(input)
}

export function ValidatePartialProducto(input: unknown){
    return productoSchema.partial().safeParse(input)
}

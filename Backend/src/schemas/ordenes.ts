import z from "zod"

const ordenItemSchema = z.object({
    id: z.uuid('El id del producto debe ser un UUID válido'),
    cantidad: z.number().int().positive('La cantidad debe ser mayor a 0')
})

const ordenSchema = z.object({
    productos: z.array(ordenItemSchema).min(1, 'La orden debe tener al menos un producto')
})

const estadoOrdenSchema = z.enum(['PENDIENTE', 'PAGADO', 'ENVIADO', 'COMPLETADA', 'CANCELADA'])

export type OrdenItem = z.infer<typeof ordenItemSchema>
export type OrdenInput = z.infer<typeof ordenSchema>
export type EstadoOrden = z.infer<typeof estadoOrdenSchema>

export function ValidateOrden(input: unknown){
    return ordenSchema.safeParse(input)
}

export function ValidateEstadoOrden(input: unknown){
    return z.object({ estado: estadoOrdenSchema }).safeParse(input)
}
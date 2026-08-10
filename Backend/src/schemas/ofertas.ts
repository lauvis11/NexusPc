import { z } from 'zod'

export const OfertaSchema = z.object({
    producto_id: z.uuid(),
    tipo: z.enum(['porcentaje', 'monto_fijo']),
    valor: z.number().positive(),
    fecha_inicio: z.iso.datetime(),
    fecha_fin: z.iso.datetime(),
})

export type OfertaInput = z.infer<typeof OfertaSchema>
export type OfertaInputPartial = z.infer<typeof OfertaSchema.partial>

export function ValidateOferta(data: unknown) {
    return OfertaSchema.safeParse(data)
}

export function ValidatePartialOferta(data: unknown){
    return OfertaSchema.partial().safeParse(data)
}
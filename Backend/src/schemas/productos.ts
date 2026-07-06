import z from 'zod'

const idSchema = z.uuid()
export function ValidateId(input: string){
    return idSchema.safeParse(input)
}
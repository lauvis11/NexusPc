import { pool } from "../config/db.js";
import type { OfertaInput, OfertaInputPartial } from "../schemas/ofertas.js";

export class OfertasModel{
    static async create(input: OfertaInput){
        const {
            producto_id,
            tipo,
            valor,
            fecha_inicio,
            fecha_fin
        } = input

        const productoEnOferta = await pool.query(
            `INSERT INTO oferta(producto_id, tipo, valor, fecha_inicio, fecha_fin)
            VALUES($1, $2, $3, $4, $5) RETURNING *
            `, [producto_id, tipo, valor, fecha_inicio, fecha_fin] 
        )
        return productoEnOferta.rows[0]
    }

    static async update({id, input}: {id: string, input: OfertaInputPartial}){
        const DATOS_PERMITIDOS = new Set(["producto_id", "tipo", "valor", "fecha_inicio", "fecha_fin"])

        const entries = Object.entries(input as Record<string, unknown>).filter(
            ([key]) => DATOS_PERMITIDOS.has(key)
        )

        if (entries.length === 0) return null

        const existe = await pool.query(
            'SELECT id FROM producto WHERE id = $1', [id]
        )
        if(existe.rows.length === 0) return null

        const setClauses = entries.map(([key], i) => `${key} = $${i + 1}`)
        const values = entries.map(([, value]) => value)

        const updateDatos = await pool.query(
            `UPDATE oferta SET ${setClauses.join(', ')} WHERE id = $${values.length + 1}
            RETURNING producto_id, tipo, valor, fecha_inicio, fecha_fin`,
            [...values, id]
        )

        return updateDatos.rows[0]
    }
    static async delete(id: string){}
}
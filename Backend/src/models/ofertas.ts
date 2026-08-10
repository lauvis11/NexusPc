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

    static async update({id, input}: {id: string, input: OfertaInputPartial}){}
    static async delete(id: string){}
}
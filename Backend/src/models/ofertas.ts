import { pool } from "../config/db.js";
import type { OfertaInput, OfertaInputPartial } from "../schemas/ofertas.js";

export class OfertasModel{
    static async getAll(){
        const result = await pool.query(
            `SELECT 
                oferta.id,
                oferta.producto_id,
                producto.nombre AS producto_nombre,
                producto.precio AS precio_original,
                oferta.tipo,
                oferta.valor,
                oferta.fecha_inicio,
                oferta.fecha_fin,
                oferta.activo
            FROM oferta
            JOIN producto ON producto.id = oferta.producto_id
            ORDER BY oferta.id DESC`
        )
        return result.rows
    }

    static async create(input: OfertaInput){
        const {
            producto_id,
            tipo,
            valor,
            fecha_inicio,
            fecha_fin
        } = input

        if (tipo === 'monto_fijo') {
            const productoResult = await pool.query(
                'SELECT precio FROM producto WHERE id = $1', [producto_id]
            )
            if (productoResult.rows.length === 0) throw new Error('El producto no existe')
            const precioProducto = Number(productoResult.rows[0].precio)
            if (valor >= precioProducto) {
                throw new Error('El valor del descuento no puede ser mayor o igual al precio del producto')
            }
        }

        const productoEnOferta = await pool.query(
            `INSERT INTO oferta(producto_id, tipo, valor, fecha_inicio, fecha_fin)
            VALUES($1, $2, $3, $4, $5) RETURNING *
            `, [producto_id, tipo, valor, fecha_inicio, fecha_fin] 
        )
        return productoEnOferta.rows[0]
    }

    static async update({id, input}: {id: string, input: OfertaInputPartial}){
        const DATOS_PERMITIDOS = new Set(["producto_id", "tipo", "valor", "fecha_inicio", "fecha_fin", "activo"])

        const entries = Object.entries(input as Record<string, unknown>).filter(
            ([key]) => DATOS_PERMITIDOS.has(key)
        )

        if (entries.length === 0) return null

        const existe = await pool.query(
            'SELECT id FROM oferta WHERE id = $1', [id]
        )
        if(existe.rows.length === 0) return null

        const setClauses = entries.map(([key], i) => `${key} = $${i + 1}`)
        const values = entries.map(([, value]) => value)

        const updateDatos = await pool.query(
            `UPDATE oferta SET ${setClauses.join(', ')} WHERE id = $${values.length + 1}
            RETURNING producto_id, tipo, valor, fecha_inicio, fecha_fin, activo`,
            [...values, id]
        )

        return updateDatos.rows[0] ?? null
    }
    static async delete(id: string){
        const existe = await pool.query(
            'SELECT id FROM oferta WHERE id = $1', [id]
        )
        if(existe.rows.length === 0) return null

        await pool.query(
            'DELETE FROM oferta WHERE id = $1',
            [id]
        )
        return true
    }
}
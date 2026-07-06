import { pool } from "../config/db.js";

export class ProductosModel{
    static async getAll({ categoria }: {categoria?: string | undefined}){
        if(categoria){
            const producto = await pool.query(
                `SELECT producto.id, producto.nombre, descripcion, precio, stock, img_url, public_id, created_at, categoria.nombre as categoria FROM producto
                JOIN categoria ON categoria.id = producto.categoria_id
                WHERE categoria.nombre = $1
                `, [categoria]
            )

            return producto.rows
        }
        const productos = await pool.query(
            `SELECT producto.id, producto.nombre, descripcion, precio, stock, img_url, public_id, created_at, categoria.nombre as categoria FROM producto
            JOIN categoria ON categoria.id = producto.categoria_id
            `
        )

        return productos.rows
    }

    static async getById({ id }: {id: string}){
        const producto = await pool.query(
            `SELECT producto.id, producto.nombre, descripcion, precio, stock, img_url, public_id, created_at, categoria.nombre as categoria FROM producto
            JOIN categoria ON categoria.id = producto.categoria_id
            WHERE producto.id = $1
            `, [id]
        )

        if(producto === undefined) return null

        return producto.rows[0]
    }
}
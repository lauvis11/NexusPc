import { pool } from "../config/db.js";
import type { CategoriaInput } from "../schemas/categorias.js"

export class CategoriasModel{
    static async getAll(){
        const categorias = await pool.query(
            `SELECT id, nombre FROM categoria`
        )

        return categorias.rows
    }

    static async create({ nombre }: CategoriaInput){
        const existe = await pool.query(
            `SELECT id FROM categoria WHERE LOWER(nombre) = LOWER($1)`, [nombre]
        )
        if (existe.rows.length > 0) return null

        const nuevaCategoria = await pool.query(
            `INSERT INTO categoria(nombre) VALUES($1)
            RETURNING id, nombre`, [nombre]
        )
        return nuevaCategoria.rows[0]
    }

    static async delete(id: string){
        const eliminarCategoria = await pool.query(
            `DELETE FROM categoria WHERE id = $1`, [id]
        )

        if(eliminarCategoria.rowCount === null) return null
        return eliminarCategoria.rowCount > 0
    }
}
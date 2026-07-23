import { pool } from "../config/db.js";
import type { SubcategoriaInput } from "../schemas/subcategorias.js";

export class SubcategoriasModel{
    static async getAll({ categoria_id }: { categoria_id?: number } = {}){
        if(categoria_id){
            const subcategorias = await pool.query(
                `SELECT id, nombre, categoria_id FROM subcategoria WHERE categoria_id = $1
                ORDER BY nombre ASC`, [categoria_id]
            )
            return subcategorias.rows
        }

        const subcategorias = await pool.query(
            `SELECT id, nombre, categoria_id FROM subcategoria ORDER BY nombre ASC`
        )
        return subcategorias.rows
    }

    static async create({ nombre, categoria_id }: SubcategoriaInput){
        const categoriaExiste = await pool.query(
            `SELECT id FROM categoria WHERE id = $1`, [categoria_id]
        )
        if(categoriaExiste.rows.length === 0) return null

        const nuevaSubcategoria = await pool.query(
            `INSERT INTO subcategoria(nombre, categoria_id) VALUES($1, $2)
            RETURNING id, nombre, categoria_id`, [nombre, categoria_id]
        )
        return nuevaSubcategoria.rows[0]
    }
}

import { pool } from "../config/db.js";

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
}

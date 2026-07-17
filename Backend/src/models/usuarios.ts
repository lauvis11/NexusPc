import { pool } from "../config/db.js"
import bcrypt from 'bcrypt'
import type { FacturacionInput, UpdateFacturacionInput } from "../schemas/datos_facturacion.js"

export class UsuariosModel{
    static async getAll(){
        const usuarios = await pool.query(
            `SELECT id, nombre, email, created_at FROM usuario
            WHERE activo = true`
        )

        return usuarios.rows
    }
    
    static async getPerfil(id: number){
        const usuario = await pool.query(
            `SELECT 
                usuario.id, 
                nombre, 
                email, 
                created_at, 
                datos_facturacion.nombre_completo,
                datos_facturacion.dni,
                datos_facturacion.direccion,
                datos_facturacion.ciudad,
                datos_facturacion.provincia,
                datos_facturacion.codigo_postal
            FROM usuario
            LEFT JOIN datos_facturacion ON datos_facturacion.usuario_id = usuario.id
            WHERE usuario.id = $1 AND activo = true`, [id]
        )

        if(usuario.rows.length === 0) return null

        return usuario.rows[0]
    }

    static async createDatosFacturacion({id, input}: {id: number, input: FacturacionInput}){
            const {
                nombre_completo,
                dni,
                direccion,
                ciudad,
                provincia,
                codigo_postal
            } = input

            const existe = await pool.query(
                `SELECT id FROM datos_facturacion WHERE usuario_id = $1`, [id]
            )
            if(existe.rows.length > 0) return null
    
            const insertarDatos = await pool.query(
                `INSERT INTO datos_facturacion(nombre_completo, dni, direccion, ciudad, provincia, codigo_postal, usuario_id)
                VALUES($1, $2, $3, $4, $5, $6, $7)
                RETURNING usuario_id, nombre_completo, dni, direccion, ciudad, provincia, codigo_postal
                `, [nombre_completo, dni, direccion, ciudad, provincia, codigo_postal, id]
            )

            return insertarDatos.rows[0]
    }
    
    static async updateDatosFacturacion({id, input}: {id: number, input: Partial<UpdateFacturacionInput>}){
        const DATOS_PERMITIDOS = new Set(["nombre_completo", "direccion", "ciudad", "provincia", "codigo_postal"])

        const entries = Object.entries(input).filter(
            ([key]) => DATOS_PERMITIDOS.has(key)
        )

        if (entries.length === 0) return null

        const existe = await pool.query(
            `SELECT id FROM datos_facturacion WHERE usuario_id = $1`, [id]
        )
        if (existe.rows.length === 0) return null

        const setClauses = entries.map(([key], i) => `${key} = $${i + 1}`)
        const values = entries.map(([, value]) => value)

        const updateDatos = await pool.query(
            `UPDATE datos_facturacion SET ${setClauses.join(', ')} WHERE usuario_id = $${values.length + 1}
            RETURNING nombre_completo, dni, direccion, ciudad, provincia, codigo_postal`,
            [...values, id]
        )

        return updateDatos.rows[0]
    }

    static async deleteUsuario(id: number){
        await pool.query(
            `DELETE FROM refresh_token WHERE usuario_id = $1`, [id]
        )

        const desactivarCuenta = await pool.query(
            `UPDATE usuario SET activo = false
            WHERE id = $1
            RETURNING id`, [id]
        )
        if(desactivarCuenta.rows.length === 0) return null
        return true
    }

    static async updatePassword({id, password, newPassword}: {id: number, password: string, newPassword: string} ){
        const getPassword = await pool.query(
            `SELECT password FROM usuario WHERE id = $1
            `, [id]
        )
        if(getPassword.rows.length === 0) return null

        const validPassword = await bcrypt.compare(password, getPassword.rows[0].password)
        if(!validPassword) return null

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)
        await pool.query(
            `UPDATE usuario SET password = $1 WHERE id = $2
            `, [hashedNewPassword, id]
        )

        return true
    }

    static async forgotPassword(){}
}
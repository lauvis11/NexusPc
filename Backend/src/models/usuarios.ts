import { pool } from "../config/db.js"
import bcrypt from 'bcrypt'

export class UsuariosModel{
    static async getAll(){
        const usuarios = await pool.query(
            `SELECT id, nombre, email, created_at FROM usuario`
        )

        return usuarios.rows
    }
    
    static async getPerfil(id: number){
        const usuario = await pool.query(
            `SELECT id, nombre, email, created_at FROM usuario
            WHERE id = $1`, [id]
        )

        if(usuario.rows.length === 0) return null

        return usuario.rows[0]
    }
    static async createDatosFacturacion(){}
    static async updateDatosFacturacion(){}
    static async deleteUsuario(){}
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
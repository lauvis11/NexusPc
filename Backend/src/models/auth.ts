import { pool } from "../config/db.js";
import type { RegisterInput } from "../schemas/auth.js";
import bcrypt from "bcrypt"

export class AuthModel{
    static async register(input: RegisterInput){
        const {
            nombre, 
            email,
            password
        } = input

        const verificarEmail = await pool.query(
            `SELECT email FROM usuario WHERE email = $1`, [email]
        )
        if(verificarEmail.rows.length > 0 ) return null

        const hashedPassword = await bcrypt.hash(password, 10)

        const crearUsuario = await pool.query(
            `INSERT INTO usuario(nombre, email, password)
            VALUES($1, $2, $3)
            RETURNING id, nombre, email
            `, [nombre, email, hashedPassword]
        )

        return crearUsuario.rows[0]
    }

    static async login(){}
    static async refresh(){}
    static async logout(){}
    static async forgotPassword(){}
}
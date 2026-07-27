import { pool } from "../config/db.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.js";
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

    static async login(input: LoginInput){
        const { email, password } = input

        const usuario = await pool.query(
            `SELECT id, nombre, password, rol FROM usuario 
            WHERE email = $1 AND activo = true
            `, [email]
        )

        if(usuario.rows.length === 0) return null

        const hashedPassword = usuario.rows[0].password

        const validPassword = await bcrypt.compare(password, hashedPassword)

        if(!validPassword) return null

        const {password: _, ...usuarioSinPassword } = usuario.rows[0]

        return usuarioSinPassword
    }

    static async saveRefreshToken(input: {token: string, usuarioId: number}){
        const { token, usuarioId } = input
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        await pool.query(
            `INSERT INTO refresh_token(token, usuario_id, expires_at)
            VALUES($1, $2, $3)`, [token, usuarioId, expiresAt] 
        )
        return true
    }

    static async findRefreshToken(refreshToken: string){
        const token = await pool.query(
            `SELECT token, expires_at FROM refresh_token WHERE token = $1
            `, [refreshToken]
        )
        if(token.rows.length === 0) return null

        return token.rows[0]
    }

    static async logout(id: number){
        await pool.query(
            `DELETE FROM refresh_token WHERE usuario_id = $1
            `, [id]
        )

        return true
    }

    // Obtiene el rol actual del usuario desde la DB.
    // Se usa en el refresh para no confiar en el rol del token viejo,
    // garantizando que un cambio de rol se refleje en el siguiente access token.
    static async getRolById(id: number){
        const result = await pool.query(
            `SELECT rol FROM usuario WHERE id = $1 AND activo = true`, [id]
        )
        if(result.rows.length === 0) return null
        return result.rows[0].rol as string
    }
}
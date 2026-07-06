import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

if (!process.env.DATABASE_URL) {
    throw new Error('La url de la base de datos no está definida en las variables de entorno')
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})


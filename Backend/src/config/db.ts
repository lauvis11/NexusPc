import pg from "pg"
import dotenv from "dotenv"
import { env } from "./env.js"

dotenv.config()

const { Pool } = pg

export const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
})


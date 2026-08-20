import pg from "pg";
import dotenv from "dotenv";
import { env } from "./env.js";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
  max: 10, // Límite máximo de conexiones simultáneas en el pool
  idleTimeoutMillis: 30000, // Cierra conexiones inactivas tras 30 segundos
  connectionTimeoutMillis: 10000, // Espera hasta 10s si la base serverless de Neon está arrancando
});

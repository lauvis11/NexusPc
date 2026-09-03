import cors from "cors";
import { env } from "../config/env.js";

const allowedOrigins = [
  env.FRONTEND_URL,
  "https://nexus-pc-front-bay.vercel.app",
  "http://localhost:3000",
].filter(Boolean);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin header Origin (server-to-server, curl, Postman)
    if (!origin) return callback(null, true);

    // Permitir FRONTEND_URL, localhost y cualquier subdominio de Vercel (*.vercel.app)
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

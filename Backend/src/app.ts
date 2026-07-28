import "./config/env.js";
import express from "express";
import cors from 'cors'
import { productosRouter } from "./routes/productos.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { categoriasRouter } from "./routes/categorias.js";
import { authRouter } from "./routes/auth.js";
import cookieParser from "cookie-parser";
import { usuariosRouter } from "./routes/usuarios.js";
import { ordenesRouter } from "./routes/ordenes.js";
import { subcategoriasRouter } from "./routes/subcategorias.js";
import { uploadRouter } from "./routes/upload.js";
import { webhookRouter } from "./routes/webhooks.js";
import { env } from "./config/env.js";
import helmet from "helmet";

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}))

app.use(express.json({limit: '1mb'}));
app.use(cookieParser())

app.get("/", (_, res) => {
    res.json({
        message: "Bienvenido a la API de NexusPC"
    })
})

app.use('/productos', productosRouter)
app.use('/categorias', categoriasRouter)
app.use('/subcategorias', subcategoriasRouter)
app.use('/auth', authRouter)
app.use('/usuarios', usuariosRouter)
app.use('/ordenes', ordenesRouter)
app.use('/admin/upload', uploadRouter)
app.use('/webhooks', webhookRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost/${PORT}`)
})
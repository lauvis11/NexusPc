import "./config/env.js";
import express from "express";
import { productosRouter } from "./routes/productos.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { categoriasRouter } from "./routes/categorias.js";
import { authRouter } from "./routes/auth.js";
import cookieParser from "cookie-parser";
import { usuariosRouter } from "./routes/usuarios.js";
import { ordenesRouter } from "./routes/ordenes.js";
import { subcategoriasRouter } from "./routes/subcategorias.js";
import { uploadRouter } from "./routes/upload.js";
import { webhookRouter } from "./routes/webhooks.js";
import helmet from "helmet";
import { ofertasRouter } from "./routes/ofertas.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const helmetFn = typeof helmet === "function" ? helmet : (helmet as any).default;
app.use((helmetFn as any)());
app.use(corsMiddleware);
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
app.use('/ofertas', ofertasRouter)
app.use('/webhooks', webhookRouter)

app.use(errorHandler)

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`)
})
import "./config/env.js";
import express from "express";
import cors from 'cors'
import { productosRouter } from "./routes/productos.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { categoriasRouter } from "./routes/categorias.js";
import { authRouter } from "./routes/auth.js";
import cookieParser from "cookie-parser";
import { usuariosRouter } from "./routes/usuarios.js";

const app = express();
const PORT = 3000;
app.use(cors())
app.use(express.json());
app.use(cookieParser())

app.get("/", (_, res) => {
    res.json({
        message: "Bienvenido a la API de NexusPC"
    })
})

app.use('/productos', productosRouter)
app.use('/categorias', categoriasRouter)
app.use('/auth', authRouter)
app.use('/usuarios', usuariosRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost/${PORT}`)
})
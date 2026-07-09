import express from "express";
import cors from 'cors'
import "./config/env.js";
import { productosRouter } from "./routes/productos.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { categoriasRouter } from "./routes/categorias.js";

const app = express();
const PORT = 3000;
app.use(cors())
app.use(express.json());

app.get("/", (_, res) => {
    res.json({
        message: "Bienvenido a la API de NexusPC"
    })
})

app.use('/productos', productosRouter)
app.use('/categorias', categoriasRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost/${PORT}`)
})
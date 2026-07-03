import express from "express";
import { productosRouter } from "./src/routes/productos.js";

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", (_, res) => {
    res.json({
        message: "Bienvenido a la API de NexusPC"
    })
})

app.use('/productos', productosRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost/${PORT}`)
})
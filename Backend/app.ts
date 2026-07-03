import express from "express";
const app = express();

const PORT = 3000;
app.use(express.json());

app.get("/", (_, res) => {
    res.json({
        message: "Bienvenido a la API de NexusPC"
    })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: http://localhost/${PORT}`)
})
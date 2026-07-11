import { Router } from "express";
import { CategoriasController } from "../controllers/categorias.js";
import { VerifyToken } from "../middlewares/verifyToken.js";
import { VerifyAdmin } from "../middlewares/verifyAdmin.js";
export const categoriasRouter: Router = Router()

categoriasRouter.get("/", CategoriasController.getAll)
categoriasRouter.post("/", VerifyToken, VerifyAdmin('ADMIN'), CategoriasController.create)
categoriasRouter.delete("/:id", VerifyToken, VerifyAdmin('ADMIN'), CategoriasController.delete)
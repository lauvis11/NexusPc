import { Router } from "express";
import { CategoriasController } from "../controllers/categorias.js";
export const categoriasRouter: Router = Router()

categoriasRouter.get("/", CategoriasController.getAll)
categoriasRouter.post("/", CategoriasController.create)
categoriasRouter.delete("/:id", CategoriasController.delete)
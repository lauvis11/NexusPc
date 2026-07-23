import { Router } from "express";
import { SubcategoriasController } from "../controllers/subcategorias.js";
import { VerifyToken } from "../middlewares/verifyToken.js";
import { VerifyAdmin } from "../middlewares/verifyAdmin.js";
export const subcategoriasRouter: Router = Router()

subcategoriasRouter.get("/", SubcategoriasController.getAll)
subcategoriasRouter.post("/", VerifyToken, VerifyAdmin('ADMIN'), SubcategoriasController.create)
subcategoriasRouter.delete("/:id", VerifyToken, VerifyAdmin('ADMIN'), SubcategoriasController.delete)

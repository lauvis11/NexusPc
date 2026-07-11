import { Router } from "express";
import { ProductosController } from "../controllers/productos.js";
import { VerifyToken } from "../middlewares/verifyToken.js";
import { VerifyAdmin } from "../middlewares/verifyAdmin.js";
export const productosRouter: Router = Router()

productosRouter.get('/', ProductosController.getAll)
productosRouter.get('/:id', ProductosController.getById)
productosRouter.post('/', VerifyToken, VerifyAdmin('ADMIN'), ProductosController.create)
productosRouter.patch('/:id', VerifyToken, VerifyAdmin('ADMIN'), ProductosController.update)
productosRouter.delete('/:id', VerifyToken, VerifyAdmin('ADMIN'), ProductosController.delete)

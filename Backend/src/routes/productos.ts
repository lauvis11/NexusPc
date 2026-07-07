import { Router } from "express";
import { ProductosController } from "../controllers/productos.js";
export const productosRouter: Router = Router()

productosRouter.get('/', ProductosController.getAll)
productosRouter.get('/:id', ProductosController.getById)
productosRouter.post('/', ProductosController.create)
// productosRouter.patch('/:id', ProductosController.update)
// productosRouter.delete('/:id', ProductosController.delete)

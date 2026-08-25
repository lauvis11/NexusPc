import { Router } from "express";
import { OrdenesController } from "../controllers/ordenes.js";
import { VerifyToken } from "../middlewares/verifyToken.js";
import { VerifyAdmin } from "../middlewares/verifyAdmin.js";
export const ordenesRouter: Router = Router()

ordenesRouter.get("/", VerifyToken, OrdenesController.getAll)
ordenesRouter.get("/:id", VerifyToken, OrdenesController.getById)
ordenesRouter.post("/", VerifyToken, OrdenesController.create)
ordenesRouter.patch("/:id/estado", VerifyToken, VerifyAdmin('ADMIN'), OrdenesController.updateEstado)
ordenesRouter.post("/:id/pago", VerifyToken, OrdenesController.crearPreferenciaPago)

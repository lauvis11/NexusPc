import { Router } from "express";
import { OfertasController } from "../controllers/ofertas.js";
import { VerifyAdmin } from "../middlewares/verifyAdmin.js";
import { VerifyToken } from "../middlewares/verifyToken.js";

export const ofertasRouter: Router = Router()

ofertasRouter.get("/", VerifyToken, VerifyAdmin('ADMIN'), OfertasController.getAll)
ofertasRouter.post("/", VerifyToken, VerifyAdmin('ADMIN'), OfertasController.create)
ofertasRouter.patch("/:id", VerifyToken, VerifyAdmin('ADMIN'), OfertasController.update)
ofertasRouter.delete("/:id", VerifyToken, VerifyAdmin('ADMIN'), OfertasController.delete)
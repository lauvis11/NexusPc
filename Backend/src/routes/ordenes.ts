import { Router } from "express";
import { OrdenesController } from "../controllers/ordenes.js";
export const ordenesRouter: Router = Router()

ordenesRouter.get("/", OrdenesController.getAll)


import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
export const authRouter: Router = Router()

authRouter.post("/login", AuthController.login)
authRouter.post("/register", AuthController.register)
authRouter.post("/logout", AuthController.logout)
authRouter.post("/refresh", AuthController.refresh)
authRouter.post("/forgot-password", AuthController.forgotPassword)





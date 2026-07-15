import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
import { VerifyToken } from "../middlewares/verifyToken.js";
export const authRouter: Router = Router()

authRouter.post("/login", AuthController.login)
authRouter.post("/register", AuthController.register)
authRouter.post("/logout", VerifyToken, AuthController.logout)
authRouter.post("/refresh", AuthController.refresh)





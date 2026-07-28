import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
import { VerifyToken } from "../middlewares/verifyToken.js";
import { loginLimiter, registerLimiter, refreshLimiter } from "../middlewares/rate-limit.js";
export const authRouter: Router = Router()

authRouter.post("/login", loginLimiter, AuthController.login)
authRouter.post("/register", registerLimiter, AuthController.register)
authRouter.post("/logout", VerifyToken, AuthController.logout)
authRouter.post("/refresh", refreshLimiter, AuthController.refresh)






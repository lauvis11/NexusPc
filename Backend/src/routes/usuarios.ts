import { Router } from "express";
import { UsuariosController } from "../controllers/usuarios.js";
import { VerifyToken } from "../middlewares/verifyToken.js";
import { VerifyAdmin } from "../middlewares/verifyAdmin.js";
export const usuariosRouter: Router = Router()

usuariosRouter.get("/", VerifyToken, VerifyAdmin('ADMIN'), UsuariosController.getAll)
usuariosRouter.get("/perfil", VerifyToken, UsuariosController.getPerfil)
usuariosRouter.post("/datos-facturacion", VerifyToken, UsuariosController.createDatosFacturacion)
usuariosRouter.put("/datos-facturacion", VerifyToken, UsuariosController.updateDatosFacturacion)
usuariosRouter.delete("/:id", VerifyToken, VerifyAdmin('ADMIN'), UsuariosController.deleteUsuario)
usuariosRouter.post("/update-password", VerifyToken, UsuariosController.updatePassword)
usuariosRouter.post("/forgot-password", UsuariosController.forgotPassword)


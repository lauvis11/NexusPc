import type { NextFunction, Request, Response } from "express"
import { UsuariosModel } from "../models/usuarios.js"
import { ValidateNewPassword } from "../schemas/usuarios.js"

export class UsuariosController{
    static async getAll(_req: Request, res: Response, next: NextFunction){
        try{
            const usuarios = await UsuariosModel.getAll()
            return res.status(200).json(usuarios)
        }catch(err){
            return next(err)
        }
    }
    
    static async getPerfil(req: Request, res: Response, next: NextFunction){
        const id = req.usuario?.id
        if(!id) return res.status(401).json({message: 'Acceso no autorizado'})
        try{
            const usuario = await UsuariosModel.getPerfil(id)
            if(usuario === null) return res.status(404).json({message: 'El usuario no existe'})
            return res.status(200).json(usuario)
        }catch(err){
            return next(err)
        }
    }
    static async createDatosFacturacion(){}
    static async updateDatosFacturacion(){}
    static async deleteUsuario(){}
    static async updatePassword(req: Request, res: Response, next: NextFunction){
        const id = req.usuario?.id
        if(!id) return res.status(401).json({message: 'Acceso no autorizado'}) 
        const result = ValidateNewPassword(req.body)
        if(!result.success) return res.status(400).json({message: 'Datos Invalidos'})
        try{
            const updatePassword = await UsuariosModel.updatePassword({id: id, password: result.data.password, newPassword: result.data.newPassword})
            if(updatePassword === null) return res.status(400).json({message: 'Contraseña incorrecta'})
            return res.status(200).json({message: 'Contraseña actualizada correctamente'})
        }catch(err){
            return next(err)
        }
    }

    static async forgotPassword(){}
}
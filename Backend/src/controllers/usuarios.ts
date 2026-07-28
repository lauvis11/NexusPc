import type { NextFunction, Request, Response } from "express"
import { UsuariosModel } from "../models/usuarios.js"
import { ValidateNewPassword } from "../schemas/usuarios.js"
import { ValidateFacturacion, ValidatePartialFacturacion } from "../schemas/datos_facturacion.js"

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

    static async createDatosFacturacion(req: Request, res: Response, next: NextFunction){
        const id = req.usuario?.id
        if(!id) return res.status(401).json({message: "Acceso no autorizado"})
        const result = ValidateFacturacion(req.body)
        if(!result.success) return res.status(400).json({message: "Datos invalidos"})

        try{
            const crearDatosFacturacion = await UsuariosModel.createDatosFacturacion({id: id, input: result.data})
            if(crearDatosFacturacion === null) return res.status(409).json({ message: "El usuario ya tiene datos de facturación cargados" })
            return res.status(201).json(crearDatosFacturacion)
        }catch(err){
            return next(err)
        }
    }

    static async updateDatosFacturacion(req: Request, res: Response, next: NextFunction){
        const id = req.usuario?.id
        if(!id) return res.status(401).json({message: "Acceso no autorizado"})
        const result = ValidatePartialFacturacion(req.body)
        if(!result.success) return res.status(400).json({message: "Datos invalidos"})

        try{
            const updateDatos = await UsuariosModel.updateDatosFacturacion({id: id, input: result.data})
            if(updateDatos === null) return res.status(404).json({ message: "No tenés datos de facturación cargados, creálos primero" })
            return res.status(200).json(updateDatos)
        }catch(err){
            return next(err)
        }
    }

    static async deleteUsuario(req: Request, res: Response, next: NextFunction){
        const { id } = req.params as { id: string }
        const idNum = parseInt(id)
        if(isNaN(idNum)) return res.status(400).json({ message: 'ID inválido' })
        
        // Evita que un admin se elimine a sí mismo
        if(idNum === req.usuario?.id) return res.status(400).json({message: 'No podés eliminar tu propia cuenta'})
        
        try{
            const desactivarCuenta = await UsuariosModel.deleteUsuario(idNum)
            if(desactivarCuenta === null) return res.status(404).json({message: "No se encontro el usuario"})
            return res.status(200).json({message: "Usuario eliminado con exito"})
        }catch(err){
            return next(err)
        }
    }

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
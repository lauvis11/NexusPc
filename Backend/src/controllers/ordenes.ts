import type { NextFunction, Request, Response } from "express";
import { OrdenesModel } from "../models/ordenes.js";
import { ValidateId } from "../schemas/productos.js";

export class OrdenesController{
    static async getAll(req: Request, res: Response, next: NextFunction){
        const usuario = req.usuario
        if(!usuario) return res.status(401).json({message: 'Acceso no autorizado'})
        try{
            if(usuario.rol === 'ADMIN') {
                const ordenes = await OrdenesModel.getAll()
                return res.status(200).json(ordenes)
            }   
            const ordenesPorUsuario = await OrdenesModel.getByUsuario(usuario.id)
            return res.status(200).json(ordenesPorUsuario)
        }catch(err){
            return next(err)
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction){
        const id = req.params.id as string
        const validId = ValidateId(id)
        if(!validId.success) return res.status(400).json({message: 'Datos invalidos'})
        try{
            const orden = await OrdenesModel.getById(validId.data)
            if(orden === null) return res.status(404).json({message: 'No se encontro la orden'})
            return res.status(200).json(orden)
        }catch(err){
            return next(err)
        }
    }
}
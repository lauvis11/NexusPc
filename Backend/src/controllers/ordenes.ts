import type { NextFunction, Request, Response } from "express";
import { OrdenesModel } from "../models/ordenes.js";

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
}
import type { NextFunction, Request, Response } from "express"
import { ValidateOferta } from "../schemas/ofertas.js"
import { OfertasModel } from "../models/ofertas.js"


export class OfertasController{
    static async create(req: Request, res: Response, next: NextFunction){
        const result = ValidateOferta(req.body)
        if(!result.success){
            return res.status(400).json({message: "Datos invalidos"})
        }

        try{
            const productoEnOferta = await OfertasModel.create(result.data)
            return res.status(201).json(productoEnOferta)
        }catch(err){
            return next(err)
        }
    }
}
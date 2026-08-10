import type { NextFunction, Request, Response } from "express"
import { ValidateOferta, ValidatePartialOferta } from "../schemas/ofertas.js"
import { OfertasModel } from "../models/ofertas.js"
import { ValidateId } from "../schemas/productos.js"


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

    static async update(req: Request, res: Response, next: NextFunction){
        const { id } = req.params as {id: string}
        const validId = ValidateId(id)
        const result = ValidatePartialOferta(req.body)
        if(!validId.success || !result.success){
            return res.status(400).json({message: "Datos invalidos"})
        }

        try{
            const productoEnOferta = await OfertasModel.update({id: validId.data, data: result.data})
            return res.status(200).json(productoEnOferta)
        }catch(err){
            return next(err)
        }
    }
}
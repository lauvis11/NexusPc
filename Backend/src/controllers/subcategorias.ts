import type { NextFunction, Request, Response } from "express";
import { SubcategoriasModel } from "../models/subcategorias.js";

export class SubcategoriasController{
    static async getAll(req: Request, res: Response, next: NextFunction){
        const categoria_id = req.query.categoria_id !== undefined
            ? Number(req.query.categoria_id)
            : undefined

        if(categoria_id !== undefined && isNaN(categoria_id)){
            return res.status(400).json({message: 'El categoria_id debe ser un número válido'})
        }

        try{
            const subcategorias = await SubcategoriasModel.getAll({ categoria_id })
            return res.status(200).json(subcategorias)
        }catch(err){
            return next(err)
        }
    }

}

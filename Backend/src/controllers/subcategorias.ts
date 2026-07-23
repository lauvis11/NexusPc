import type { NextFunction, Request, Response } from "express";
import { SubcategoriasModel } from "../models/subcategorias.js";
import { ValidateSubcategoria } from "../schemas/subcategorias.js";

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

    static async create(req: Request, res: Response, next: NextFunction){
        const result = ValidateSubcategoria(req.body)
        if(!result.success) return res.status(400).json({message: 'Datos invalidos'})
        try{
            const nuevaSubcategoria = await SubcategoriasModel.create(result.data)
            if(nuevaSubcategoria === null) {
                return res.status(404).json({message: 'La categoría especificada no existe'})
            }
            if(nuevaSubcategoria === 'CONFLICT') {
                return res.status(409).json({message: 'La subcategoría ya existe para esta categoría'})
            }
            return res.status(201).json(nuevaSubcategoria)
        }catch(err){
            return next(err)
        }
    }
}

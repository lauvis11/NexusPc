import type { NextFunction, Request, Response } from "express";
import { CategoriasModel } from "../models/categorias.js";
import { ValidateCategoria } from "../schemas/categorias.js";

export class CategoriasController{
    static async getAll(_req: Request, res: Response, next: NextFunction){
        try{
            const categorias = await CategoriasModel.getAll()
            return res.status(200).json({categorias})
        }catch(err){
            return next(err)
        }
    }

    static async create(req: Request, res: Response, next: NextFunction){
        const result = ValidateCategoria(req.body)
        if(!result.success) return res.status(400).json({message: "Datos Invalidos"})
        try{
            const nuevaCategoria = await CategoriasModel.create(result.data)
            if(nuevaCategoria === null) return res.status(409).json({message: "La categoría ya existe"})
            return res.status(201).json(nuevaCategoria)
        }catch(err){
            return next(err)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction){
        const { id } = req.params as {id: string}
        try{
            const categoriaEliminada = await CategoriasModel.delete(id)
            if(!categoriaEliminada) return res.status(404).json({message: "No se encontro la categoria a eliminar"})
            return res.status(200).json({message: 'Categoria eliminada con exito'})
        }catch(err){
            return next(err)
        }
    }
}
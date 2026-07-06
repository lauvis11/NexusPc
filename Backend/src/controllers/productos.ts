import type { Request, Response } from "express";
import { ProductosModel } from "../models/productos.js";
import { ValidateId } from "../schemas/productos.js";

export class ProductosController{
    static async getAll(req: Request, res: Response){
        const categoria = typeof req.query.categoria === 'string'
        ? req.query.categoria
        : undefined
        try{
            const productos = await ProductosModel.getAll({ categoria })
            res.status(200).json(productos)
        }catch(error){
            if(error instanceof Error) res.status(500).json({message: "Error de servidor"})
        }
    }
    static async getById(req: Request, res: Response){
        const { id } = req.params as {id: string}
        const result = ValidateId(id)
        if(!result.success) return res.status(400).json({message: "El id es invalido"})
        try{
            const producto = await ProductosModel.getById({ id: result.data })
            if(producto === null) return res.status(404).json({message: "El producto no existe"})
            return res.status(200).json(producto)
        }catch(error){
            return res.status(500).json({message: "Error de servidor"})
        }
    }
    // static async create(req: Request, res: Response){

    // }

    // static async update(req: Request, res: Response){

    // }

    // static async delete(req: Request, res: Response){

    // }
}
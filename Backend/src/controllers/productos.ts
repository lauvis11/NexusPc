import type { NextFunction, Request, Response } from "express";
import { ProductosModel } from "../models/productos.js";
import { ValidateId, ValidateProducto } from "../schemas/productos.js";

export class ProductosController{
    static async getAll(req: Request, res: Response, next: NextFunction){
        const categoria = typeof req.query.categoria === 'string'
        ? req.query.categoria
        : undefined
        try{
            const productos = await ProductosModel.getAll({ categoria })
            return res.status(200).json(productos)
        }catch(err){
            return next(err)
        }
    }
    static async getById(req: Request, res: Response, next: NextFunction){
        const { id } = req.params as {id: string}
        const result = ValidateId(id)
        if(!result.success) return res.status(400).json({message: "El id es invalido"})
        try{
            const producto = await ProductosModel.getById(result.data)
            if(producto === null) return res.status(404).json({message: "El producto no existe"})
            return res.status(200).json(producto)
        }catch(err){
            return next(err)
        }
    }
    static async create(req: Request, res: Response, next: NextFunction){
        const result = ValidateProducto(req.body)
        if(!result.success) return res.status(400).json({message: "Datos de producto invalidos"})
        try{
            const ProductoNuevo = await ProductosModel.create(result.data)
            return res.status(200).json(ProductoNuevo)
        }catch(err){
            return next(err)
        }
    }

    // static async update(req: Request, res: Response){

    // }

    // static async delete(req: Request, res: Response){

    // }
}
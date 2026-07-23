import type { NextFunction, Request, Response } from "express";
import { ProductosModel } from "../models/productos.js";
import { ValidateId, ValidatePartialProducto, ValidateProducto } from "../schemas/productos.js";

export class ProductosController{
    static async getAll(req: Request, res: Response, next: NextFunction){
        const categoria = typeof req.query.categoria === 'string'
            ? req.query.categoria
            : undefined

        const subcategoria_id = req.query.subcategoria_id !== undefined
            ? Number(req.query.subcategoria_id)
            : undefined

        if (subcategoria_id !== undefined && isNaN(subcategoria_id)) {
            return res.status(400).json({ message: 'El subcategoria_id debe ser un número válido' })
        }

        try{
            const productos = await ProductosModel.getAll({ categoria, subcategoria_id })
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
            return res.status(201).json(ProductoNuevo)
        }catch(err){
            if (err instanceof Error && err.message.includes('subcategoría')) {
                return res.status(400).json({message: err.message})
            }
            return next(err)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction){
        const { id } = req.params as {id: string}
        const validId = ValidateId(id)
        const result = ValidatePartialProducto(req.body)
        if(!validId.success || !result.success){
            return res.status(400).json({message: "Invalid Data"})
        }

        try{
            const productoActualizado = await ProductosModel.update({id: validId.data, input: result.data})
            if(productoActualizado === null) return res.status(404).json({message: "Datos invalidos"})
            return res.status(200).json(productoActualizado)
        }catch(err){
            if (err instanceof Error && err.message.includes('subcategoría')) {
                return res.status(400).json({message: err.message})
            }
            return next(err)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction){
        const { id } = req.params as {id: string}
        const validId = ValidateId(id)
        if(!validId.success) return res.status(400).json({message: "Datos invalidos"})
        try{
            const productoEliminado = await ProductosModel.delete(validId.data)
            if(!productoEliminado) return res.status(404).json({message: "No se encontro el producto a eliminar"})
            return res.status(200).json({message: 'Producto eliminado con exito'})
        }catch(err){
            return next(err)
        }
    }
}
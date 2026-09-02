import type { NextFunction, Request, Response } from "express";
import { ProductosModel } from "../models/productos.js";
import { ValidateId, ValidatePartialProducto, ValidateProducto } from "../schemas/productos.js";
import cloudinary from "../config/cloudinary.js";

export class ProductosController{
    static async getAll(req: Request, res: Response, next: NextFunction){
        // --- Filtros de categoría (existentes) ---
        const categoria = typeof req.query.categoria === 'string'
            ? req.query.categoria.trim() || undefined
            : undefined

        const subcategoria_id = req.query.subcategoria_id !== undefined
            ? Number(req.query.subcategoria_id)
            : undefined

        if (subcategoria_id !== undefined && isNaN(subcategoria_id)) {
            return res.status(400).json({ message: 'El subcategoria_id debe ser un número válido' })
        }

        // --- Filtros nuevos ---
        const precio_min = req.query.precio_min !== undefined
            ? Number(req.query.precio_min)
            : undefined

        if (precio_min !== undefined && (isNaN(precio_min) || precio_min < 0)) {
            return res.status(400).json({ message: 'El precio_min debe ser un número positivo' })
        }

        const precio_max = req.query.precio_max !== undefined
            ? Number(req.query.precio_max)
            : undefined

        if (precio_max !== undefined && (isNaN(precio_max) || precio_max < 0)) {
            return res.status(400).json({ message: 'El precio_max debe ser un número positivo' })
        }

        if (precio_min !== undefined && precio_max !== undefined && precio_min > precio_max) {
            return res.status(400).json({ message: 'El precio_min no puede ser mayor que precio_max' })
        }

        // en_stock=true filtra solo productos disponibles; cualquier otro valor se ignora
        const en_stock = req.query.en_stock === 'true' ? true : undefined

        // busqueda: se acepta por busqueda, q o search
        const rawBusqueda = req.query.busqueda ?? req.query.q ?? req.query.search
        const busqueda = typeof rawBusqueda === 'string'
            ? rawBusqueda.trim() || undefined
            : undefined

        // destacado=true filtra productos destacados; destacado=false filtra productos no destacados
        const destacado = req.query.destacado === 'true'
            ? true
            : req.query.destacado === 'false'
                ? false
                : undefined

        // en_oferta=true filtra productos en oferta activa; en_oferta=false filtra productos sin oferta
        const en_oferta = req.query.en_oferta === 'true'
            ? true
            : req.query.en_oferta === 'false'
                ? false
                : undefined

        // --- Paginación ---
        const rawPage = Number(req.query.page)
        const rawLimit = Number(req.query.limit)

        const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
        const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 20

        try{
            const { data, total } = await ProductosModel.getAll({
                categoria,
                subcategoria_id,
                precio_min,
                precio_max,
                en_stock,
                busqueda,
                destacado,
                en_oferta,
                page,
                limit
            })

            const totalPages = Math.ceil(total / limit)

            return res.status(200).json({
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            })
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
            // Si viene un public_id nuevo, destruir la imagen vieja en Cloudinary
            if (result.data.public_id) {
                const productoActual = await ProductosModel.getById(validId.data)
                if (productoActual && productoActual.public_id && productoActual.public_id !== result.data.public_id) {
                    await cloudinary.uploader.destroy(productoActual.public_id)
                }
            }

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
            // Obtener producto antes de borrar para acceder al public_id
            const producto = await ProductosModel.getById(validId.data)
            if(!producto) return res.status(404).json({message: "No se encontro el producto a eliminar"})

            const productoEliminado = await ProductosModel.delete(validId.data)
            if(!productoEliminado) return res.status(404).json({message: "No se encontro el producto a eliminar"})

            // Eliminar imagen de Cloudinary
            if (producto.public_id) {
                await cloudinary.uploader.destroy(producto.public_id)
            }

            return res.status(200).json({message: 'Producto eliminado con exito'})
        }catch(err){
            return next(err)
        }
    }
}
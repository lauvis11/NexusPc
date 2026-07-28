import type { NextFunction, Request, Response } from "express";
import { OrdenesModel } from "../models/ordenes.js";
import { ValidateId } from "../schemas/productos.js";
import { ValidateOrden, ValidateEstadoOrden } from "../schemas/ordenes.js";

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

    static async getById(req: Request, res: Response, next: NextFunction){
        const id = req.params.id as string
        const usuario = req.usuario
        if(!usuario) return res.status(401).json({ message: 'Acceso no autorizado' })
        const validId = ValidateId(id)
        if(!validId.success) return res.status(400).json({message: 'Datos invalidos'})
        try{
            const orden = await OrdenesModel.getById(validId.data)
            if(orden === null) return res.status(404).json({message: 'No se encontro la orden'})
            if(usuario.rol === 'CLIENTE' && orden.usuario_id !== usuario.id){
                return res.status(403).json({ message: 'No tenés permisos para ver esta orden' })
            }
            return res.status(200).json(orden)
        }catch(err){
            return next(err)
        }
    }

    static async create(req: Request, res: Response, next: NextFunction){
        const id = req.usuario?.id
        if(!id) return res.status(401).json({message: 'Acceso no autorizado'})
        const result = ValidateOrden(req.body)
        if(!result.success) return res.status(400).json({message: 'Datos invalidos'})
        try{
            const nuevaOrden = await OrdenesModel.create({id, input: result.data})
            if(nuevaOrden === null) return res.status(409).json({message: 'Debes cargar tus datos de facturación antes de crear una orden'})
            return res.status(201).json(nuevaOrden)
        }catch(err){
            if(err instanceof Error){
                if(err.message.includes('no encontrado')) return res.status(404).json({message: err.message})
                if(err.message.includes('Stock insuficiente')) return res.status(409).json({message: err.message})
            }
            return next(err)
        }
    }

    static async updateEstado(req: Request, res: Response, next: NextFunction){
        const usuario = req.usuario
        if(!usuario) return res.status(401).json({message: 'Acceso no autorizado'})
        if(usuario.rol !== 'ADMIN') return res.status(403).json({message: 'No tenés permisos para realizar esta acción'})

        const { id } = req.params as { id: string }
        const validId = ValidateId(id)
        if(!validId.success) return res.status(400).json({message: 'ID de orden inválido'})

        const result = ValidateEstadoOrden(req.body)
        if(!result.success) return res.status(400).json({message: 'Estado inválido'})

        try{
            const ordenActualizada = await OrdenesModel.updateEstado({ ordenId: validId.data, nuevoEstado: result.data.estado })
            return res.status(200).json(ordenActualizada)
        }catch(err){
            if(err instanceof Error){
                if(err.message.includes('no encontrada')) return res.status(404).json({message: err.message})
                if(err.message.includes('Transición inválida')) return res.status(409).json({message: err.message})
            }
            return next(err)
        }
    }

    static async crearPreferenciaPago(req: Request, res: Response, next: NextFunction){
        const usuario = req.usuario
        if(!usuario) return res.status(401).json({message: 'Acceso no autorizado'})
        const { id } = req.params as { id: string }

        try{
            const realizarPago = await OrdenesModel.crearPreferenciaPago({ orden_id: id, usuario_id: usuario.id })
            return res.status(200).json(realizarPago)
        }catch(err){
            if (err instanceof Error) {
                if (err.message.includes('no existe')) return res.status(404).json({ message: err.message })
                if (err.message.includes('no está pendiente')) return res.status(409).json({ message: err.message })
            }
            return next(err)
        }
    }
}
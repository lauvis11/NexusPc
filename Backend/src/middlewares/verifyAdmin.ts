import type { NextFunction, Request, Response } from "express";

export function VerifyAdmin(rol: string){
    return function(req: Request, res: Response, next: NextFunction){
        if(!req.usuario) return res.status(401).json({message: "Acceso no autorizado"})
        if(req.usuario.rol !== rol) return res.status(403).json({ message: 'No tenés permisos para realizar esta acción' })
        return next()
    }
}
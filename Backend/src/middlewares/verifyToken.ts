import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { env } from "../config/env.js";

export function VerifyToken(req: Request, res: Response, next: NextFunction){
    const token = req.cookies["access-token"]
    if(!token) return res.status(401).json({message: "Acceso no autorizado"})

    try{
        const data = jwt.verify(token, env.SECRET_KEY) as {id: number, rol: string}
        req.usuario = data 
        return next()
    }catch{
        return res.status(401).json({message: "Acceso no autorizado"})
    }
}
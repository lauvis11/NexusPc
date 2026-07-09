import type { NextFunction, Request, Response } from "express";
import { ValidateRegister } from "../schemas/auth.js";
import { AuthModel } from "../models/auth.js";

export class AuthController{
    static async register(req: Request, res: Response, next: NextFunction){
        const result = ValidateRegister(req.body)
        if(!result.success) return res.status(400).json({message: 'Datos Invalidos'})
        try{
            const registrarUsuario = await AuthModel.register(result.data)
            if(registrarUsuario === null) return res.status(409).json({message: 'El email ya esta registrado'})
            return res.status(201).json(registrarUsuario)
        }catch(err){
            return next(err)
        }
    }
    static async login(){}
    static async refresh(){}
    static async logout(){}
    static async forgotPassword(){}
}
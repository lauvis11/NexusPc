import type { NextFunction, Request, Response } from "express";
import { ValidateLogin, ValidateRegister } from "../schemas/auth.js";
import { AuthModel } from "../models/auth.js";
import jwt from 'jsonwebtoken'
import { env } from "../config/env.js";

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

    static async login(req: Request, res: Response, next: NextFunction){
        const result = ValidateLogin(req.body)
        if(!result.success) return res.status(400).json({message: 'Datos Invalidos'})
        try{
            const validarUsuario = await AuthModel.login(result.data)
            if(validarUsuario === null) return res.status(400).json({message: 'Credenciales Incorrectas'})
            const token = jwt.sign({id: validarUsuario.id, rol: validarUsuario.rol}, env.SECRET_KEY, {
                expiresIn: "1h"
            })

            const refreshToken = jwt.sign({id: validarUsuario.id}, env.REFRESH_KEY, {
                expiresIn: "7d"
            })
            await AuthModel.saveRefreshToken({token: refreshToken, usuarioId: validarUsuario.id})

            return res
            .status(200)
            .cookie("access-token", token, {
                httpOnly: true,      // JavaScript del cliente no puede acceder
                secure: process.env.NODE_ENV === 'production',        // solo se manda por HTTPS
                sameSite: 'strict',  // protección contra CSRF
                maxAge: 60 * 60 * 1000  // 1 hora en milisegundos
            })
            .cookie("refresh-token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict', 
                maxAge: 7 * 24 * 60 * 60 * 1000   
            })
            .json(validarUsuario)
        }catch(err){
            return next(err)
        }
    }
    static async refresh(){}
    static async logout(){}
    static async forgotPassword(){}
}
import type { NextFunction, Request, Response } from "express"
import { env } from "../config/env.js"

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction){
    console.error('[ERROR]', err.message, err.stack)
    res.status(500).json({
        message: 'Internal Server Error',
        error: env.NODE_ENV === 'development' ? err.message : undefined
    })
}
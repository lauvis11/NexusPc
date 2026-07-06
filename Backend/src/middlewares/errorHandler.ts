// export function errorHandler(err, req, res, next){
//     console.error('[ERROR]', err.message, err.stack)
//     res.status(500).json({
//         message: 'Internal Server Error',
//         error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     })
// }

import type { NextFunction, Request, Response } from "express"

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction){
    console.error('[ERROR]', err.message, err.stack)
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
}
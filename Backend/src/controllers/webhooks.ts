import type { NextFunction, Request, Response } from "express";
import { Payment } from "mercadopago";
import { client, mapaEstados } from "../services/mercadopago.js";
import { OrdenesModel } from "../models/ordenes.js";

export class WebhookController{
    // Creamos el metodo para verificar el pago y actualizar el estado de la orden
    static async verifyPago(req: Request, res: Response, next: NextFunction){
        const type = req.query.type // Extraemos el tipo del pago
        const paymentId = req.query['data.id'] as string // extraemos el id del pago
        if(type !== 'payment') return res.status(200).send() // Si el tipo es diferente a payment retornamos un status 200 para que mercadopago no siga reintentando la notificacion
        
        // Hacemos un try - catch para capturar posibles errores
        try{
            const payment = new Payment(client) // Iniciamos una instancia de payment 
            const infoPago = await payment.get({id: paymentId}) // Recuperamos la informacion del pago
            const { status, external_reference } = infoPago // Recuperamos el estado y la referencia
            if (!status || !external_reference) return res.status(200).send() // Verificamos que no sean undefined 

            // Si hay un estadoNuevo lo guardamos, si no terminamos la operacion
            const nuevoEstado = mapaEstados[status]
            if(!nuevoEstado) return res.status(200).send()
            // Actualizamos el estado del Pago
            await OrdenesModel.updateEstado({ordenId: external_reference, nuevoEstado})
            
            return res.status(200).send()
        }catch(err){
            return next(err) // Manejamos el error con el middleware
        }
    }
}
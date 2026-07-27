import type { NextFunction, Request, Response } from "express";
import { Payment } from "mercadopago";
import { client, mapaEstados } from "../services/mercadopago.js";
import { OrdenesModel } from "../models/ordenes.js";

export class WebhookController{
    // Creamos el metodo para verificar el pago y actualizar el estado de la orden
    static async verifyPago(req: Request, res: Response, next: NextFunction){
        console.log('--- WEBHOOK RECIBIDO ---', req.query) // 1: confirma que MercadoPago llegó a tu server
        const type = req.query.type // Extraemos el tipo del pago
        const paymentId = req.query['data.id'] as string // extraemos el id del pago
        if(type !== 'payment') {
            console.log('Ignorado, type no es payment:', type) // 2: si esto sale, MP manda otro evento
            return res.status(200).send() // Si el tipo es diferente a payment retornamos un status 200 para que mercadopago no siga reintentando la notificacion
        }
        // Hacemos un try - catch para capturar posibles errores
        try{
            const payment = new Payment(client) // Iniciamos una instancia de payment 
            const infoPago = await payment.get({id: paymentId}) // Recuperamos la informacion del pago
            console.log('Info pago:', infoPago.status, infoPago.external_reference) // 3: confirma qué trajo MP
            const { status, external_reference } = infoPago // Recuperamos el estado y la referencia
            if (!status || !external_reference) {
                console.log('status o external_reference undefined') // 4: si esto sale, ahí corta mal
                return res.status(200).send() // Verificamos que no sean undefined 
            }
            // Si hay un estadoNuevo lo guardamos, si no terminamos la operacion
            const nuevoEstado = mapaEstados[status]
            console.log('Mapeado a:', nuevoEstado) // 5: confirma si el mapeo encontró algo
            if(!nuevoEstado) return res.status(200).send()
                

            // Actualizamos el estado del Pago
            try {
                await OrdenesModel.updateEstado({ ordenId: external_reference, nuevoEstado })
                console.log('Orden actualizada OK') // 6: si esto sale, el update se ejecutó
            } catch (error) {
                // Si ya estaba en ese estado o la transición no aplica, no es un error real del webhook,
                // simplemente ignoramos (probablemente sea un reintento de MercadoPago)
                console.log('Error en updateEstado:', error) // 7: acá se ve si el update falló y por qué
                if (!(error instanceof Error && error.message.includes('Transición inválida'))) {
                    throw error // si es otro tipo de error, sí lo propagamos
                }
            }
            return res.status(200).send()
        }catch(err){
            console.log('Error general webhook:', err) // 8: cualquier error no controlado
            return next(err) // Manejamos el error con el middleware
        }
    }
}
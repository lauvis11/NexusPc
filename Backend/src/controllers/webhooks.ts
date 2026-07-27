import type { NextFunction, Request, Response } from "express";
import { Payment } from "mercadopago";
import { client, mapaEstados } from "../services/mercadopago.js";
import { OrdenesModel } from "../models/ordenes.js";
import { env } from "../config/env.js";
import crypto from "crypto";

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

    // Metodo que verifica la firma HMAC-SHA256 enviada por MercadoPagoen el header `x-signature`.
    static verificarFirmaMP(req: Request, res: Response, next: NextFunction){
        try {
            const xSignature = req.headers['x-signature'] as string | undefined
            const xRequestId = req.headers['x-request-id'] as string | undefined

            // Si no llegan los headers de seguridad, rechazamos la petición
            if (!xSignature || !xRequestId) {
                return res.status(400).json({ message: 'Firma de webhook ausente' })
            }

            // Extraemos el data.id del query param (puede venir como "data.id" o "id")
            const dataId = req.query['data.id'] as string | undefined

            if (!dataId) {
                // Si no hay data.id (ej: evento de prueba), dejamos pasar sin verificar
                return next()
            }

            // Parseamos el header x-signature para extraer ts y v1
            // Formato: "ts=<timestamp>,v1=<hash>"
            const partes = xSignature.split(',')

            const ts = partes
                .find(p => p.trim().startsWith('ts='))
                ?.split('=')
                .slice(1)
                .join('=')
                .trim()

            const v1 = partes
                .find(p => p.trim().startsWith('v1='))
                ?.split('=')
                .slice(1)
                .join('=')
                .trim()

            if (!ts || !v1) {
                return res.status(400).json({ message: 'Formato de firma inválido' })
            }

            // Construimos el manifest exactamente como lo define MercadoPago
            const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

            // Calculamos el HMAC-SHA256 del manifest con nuestra clave secreta
            const hmacCalculado = crypto
                .createHmac('sha256', env.WEBHOOK_SECRET)
                .update(manifest)
                .digest('hex')

            // Comparamos en tiempo constante para prevenir ataques de timing
            const firmaValida = crypto.timingSafeEqual(
                Buffer.from(hmacCalculado, 'hex'),
                Buffer.from(v1, 'hex')
            )

            if (!firmaValida) {
                console.warn('[WEBHOOK] Firma inválida — posible petición no autorizada')
                return res.status(401).json({ message: 'Firma de webhook inválida' })
            }

            // Firma válida, continuamos al handler
            return next()
        } catch (error) {
            // Si el buffer tiene longitud distinta, timingSafeEqual lanza un error
            console.warn('[WEBHOOK] Error al verificar firma:', error)
            return res.status(401).json({ message: 'Firma de webhook inválida' })
        }
    }
}
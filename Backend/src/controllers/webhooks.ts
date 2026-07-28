import type { NextFunction, Request, Response } from "express";
import { Payment } from "mercadopago";
import { client, mapaEstados } from "../services/mercadopago.js";
import { OrdenesModel } from "../models/ordenes.js";
import { env } from "../config/env.js";
import crypto from "crypto";

export class WebhookController{
    // Verifica el pago recibido desde MercadoPago y actualiza el estado de la orden
    static async verifyPago(req: Request, res: Response, next: NextFunction){
        const type = req.query.type
        const paymentId = req.query['data.id'] as string

        // Si el tipo no es "payment" respondemos 200 para que MP no reintente
        if(type !== 'payment') return res.status(200).send()

        try{
            const payment = new Payment(client)
            const infoPago = await payment.get({id: paymentId})

            const { status, external_reference } = infoPago
            if (!status || !external_reference) return res.status(200).send()

            const nuevoEstado = mapaEstados[status]
            if(!nuevoEstado) return res.status(200).send()

            try {
                await OrdenesModel.updateEstado({ ordenId: external_reference, nuevoEstado })
            } catch (error) {
                // Si la transición no aplica (reintento de MP), lo ignoramos
                if (!(error instanceof Error && error.message.includes('Transición inválida'))) {
                    throw error
                }
            }
            return res.status(200).send()
        }catch(err){
            return next(err)
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
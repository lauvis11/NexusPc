import type { NextFunction, Request, Response } from "express";
import { Payment, WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { client, mapaEstados } from "../services/mercadopago.js";
import { OrdenesModel } from "../models/ordenes.js";
import { env } from "../config/env.js";

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

    // Middleware que verifica la firma HMAC-SHA256 de MercadoPago usando el SDK oficial.
    // Delega en WebhookSignatureValidator (normaliza dataId a minúsculas y hace comparación
    // en tiempo constante internamente), siguiendo la recomendación oficial de MP.
    static verificarFirmaMP(req: Request, res: Response, next: NextFunction){
        try {
            const xSignature = req.headers['x-signature'] as string | undefined
            const xRequestId = req.headers['x-request-id'] as string | undefined
            const dataId     = req.query['data.id'] as string | undefined

            // Sin headers de seguridad rechazamos directamente
            if (!xSignature || !xRequestId) {
                return res.status(400).json({ message: 'Firma de webhook ausente' })
            }

            // Sin data.id puede ser un evento de prueba — dejamos pasar
            if (!dataId) return next()

            WebhookSignatureValidator.validate({
                xSignature,
                xRequestId,
                dataId,
                secret: env.WEBHOOK_SECRET
            })

            return next()
        } catch (error) {
            if (error instanceof InvalidWebhookSignatureError) {
                console.warn('[WEBHOOK] Firma inválida — posible petición no autorizada')
                return res.status(401).json({ message: 'Firma de webhook inválida' })
            }
            // Error inesperado (no de firma) → lo propagamos
            return res.status(500).json({ message: 'Error al verificar firma' })
        }
    }
}
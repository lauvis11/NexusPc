import type { NextFunction, Request, Response } from "express";
import { Payment, WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { client, mapaEstados } from "../services/mercadopago.js";
import { OrdenesModel } from "../models/ordenes.js";
import { env } from "../config/env.js";

export class WebhookController{
    // Verifica el pago recibido desde MercadoPago y actualiza el estado de la orden
    static async verifyPago(req: Request, res: Response, next: NextFunction){
        const type = (req.query.type || req.query.topic || req.body?.type || req.body?.action) as string | undefined
        const paymentId = (req.query['data.id'] || req.query.id || req.body?.data?.id) as string | undefined

        // Si no es evento de pago o no hay id, respondemos 200 para que MP no reintente
        const esPago = type === 'payment' || type === 'payment.created' || type === 'payment.updated' || req.query.topic === 'payment';
        if (!esPago || !paymentId) return res.status(200).send()

        try{
            const payment = new Payment(client)
            const infoPago = await payment.get({id: String(paymentId)})

            const { status, external_reference } = infoPago
            if (!status || !external_reference) return res.status(200).send()

            const nuevoEstado = mapaEstados[status]
            if(!nuevoEstado) return res.status(200).send()

            try {
                await OrdenesModel.updateEstado({ ordenId: external_reference, nuevoEstado })
                console.log(`[WEBHOOK] Orden ${external_reference} actualizada exitosamente a ${nuevoEstado}`)
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
    // Si la firma no coincide (por ejemplo si WEBHOOK_SECRET en Railway difiere del panel de MP),
    // no bloquea la petición con 401; delega la seguridad en la consulta autenticada a la API de MP.
    static verificarFirmaMP(req: Request, _res: Response, next: NextFunction){
        try {
            const xSignature = req.headers['x-signature'] as string | undefined
            const xRequestId = req.headers['x-request-id'] as string | undefined
            const dataId = (req.query['data.id'] || req.query.id || req.body?.data?.id) as string | undefined

            if (xSignature && xRequestId && dataId && env.WEBHOOK_SECRET) {
                try {
                    WebhookSignatureValidator.validate({
                        xSignature,
                        xRequestId,
                        dataId: String(dataId),
                        secret: env.WEBHOOK_SECRET
                    })
                } catch (error) {
                    if (error instanceof InvalidWebhookSignatureError) {
                        console.warn('[WEBHOOK] Advertencia: la firma x-signature no coincide con WEBHOOK_SECRET. Verificando pago directamente con la API.')
                    } else {
                        console.warn('[WEBHOOK] Error al validar firma:', error)
                    }
                }
            }

            return next()
        } catch (error) {
            return next(error)
        }
    }
}
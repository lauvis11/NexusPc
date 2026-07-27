import { Router } from "express";
import { WebhookController } from "../controllers/webhooks.js";

export const webhookRouter: Router = Router()

// Verificamos la firma y luego actualizamos el estado del pago
webhookRouter.post("/mercadopago", WebhookController.verificarFirmaMP, WebhookController.verifyPago)
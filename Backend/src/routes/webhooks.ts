import { Router } from "express";
import { WebhookController } from "../controllers/webhooks.js";

export const webhookRouter: Router = Router()

webhookRouter.post("/mercadopago", WebhookController.verifyPago)
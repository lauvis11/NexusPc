// SDK de Mercado Pago
import { MercadoPagoConfig } from 'mercadopago';
import { env } from '../config/env.js';
// Agrega credenciales
export const client = new MercadoPagoConfig({ accessToken: env.TEST_ACCESS_TOKEN});
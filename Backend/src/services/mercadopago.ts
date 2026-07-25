// SDK de Mercado Pago
import { MercadoPagoConfig} from 'mercadopago';
import { env } from '../config/env.js';
import type { EstadoOrden } from '../schemas/ordenes.js';
// Agrega credenciales
export const client = new MercadoPagoConfig({ accessToken: env.TEST_ACCESS_TOKEN});

export const mapaEstados: Record<string, EstadoOrden> = {
    approved: 'PAGADO',
    rejected: 'CANCELADA',
    pending: 'PENDIENTE',
    in_process: 'PENDIENTE'
}
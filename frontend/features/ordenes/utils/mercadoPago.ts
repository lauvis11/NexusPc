/**
 * Dominios base autorizados para la pasarela de pagos de Mercado Pago.
 */
const ALLOWED_MERCADOPAGO_HOSTNAMES = [
  "mercadopago.com.ar",
  "www.mercadopago.com.ar",
  "sandbox.mercadopago.com.ar",
  "mercadopago.com",
  "www.mercadopago.com",
  "sandbox.mercadopago.com",
];

/**
 * Valida que una URL de redirección pertenezca estrictamente a dominios oficiales de Mercado Pago bajo HTTPS.
 * Previene ataques de Open Redirect y redirección a pasarelas fraudulentas (Phishing).
 *
 * @param url URL de inicio de pago (init_point / sandbox_init_point)
 * @returns boolean true si la URL es segura y pertenece a Mercado Pago
 */
export function isValidMercadoPagoUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsed = new URL(url.trim());

    // Exige estrictamente el protocolo HTTPS
    if (parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    const isExactMatch = ALLOWED_MERCADOPAGO_HOSTNAMES.includes(hostname);
    const isLegitSubdomain =
      hostname.endsWith(".mercadopago.com.ar") ||
      hostname.endsWith(".mercadopago.com");

    return isExactMatch || isLegitSubdomain;
  } catch {
    return false;
  }
}

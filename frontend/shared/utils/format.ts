/**
 * Formatea un valor numérico o string numérico como moneda argentina (ARS).
 * Ejemplo: 150000 -> $ 150.000
 */
export function formatearPrecio(valor: number | string | null | undefined): string {
  if (valor == null) return "$0";
  const num = Number(valor);
  if (isNaN(num)) return "$0";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(num);
}

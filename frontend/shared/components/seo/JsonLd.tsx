interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Sanitiza y serializa datos para Schema.org / JSON-LD evitando vectores de inyección XSS.
 * Escapa el carácter '<' y otros delimitadores HTML para que no puedan cerrar prematuramente
 * el tag <script> ni inyectar código JavaScript ejecutable desde datos dinámicos (productos, descripciones, etc.).
 */
function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

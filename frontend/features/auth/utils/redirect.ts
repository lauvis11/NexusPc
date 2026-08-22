/**
 * Valida y sanitiza una URL de redirección para prevenir vulnerabilidades de Open Redirect (CWE-601).
 * Solo permite rutas relativas internas seguras dentro del mismo origen (ej: '/checkout', '/perfil').
 *
 * Bloquea:
 * - URLs absolutas externas (ej: 'https://evil.com', 'http://attacker.com')
 * - URLs relativas al protocolo (ej: '//evil.com')
 * - Variaciones de bypass con barra invertida (ej: '/\\evil.com')
 * - Esquemas especiales o maliciosos (ej: 'javascript:...', 'data:...')
 *
 * @param url URL o ruta obtenida del query param
 * @param defaultFallback Ruta de fallback segura si la validación falla (por defecto '/')
 * @returns Ruta relativa interna segura
 */
export function getSafeRedirect(url: string | null | undefined, defaultFallback = "/"): string {
  if (!url || typeof url !== "string") {
    return defaultFallback;
  }

  const trimmed = url.trim();

  // Debe comenzar con exactamente un '/' y no con '//' ni '/\'
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return defaultFallback;
  }

  try {
    // Se valida usando un origen base controlado
    const parsed = new URL(trimmed, "http://localhost");

    if (parsed.origin !== "http://localhost" || !parsed.pathname.startsWith("/")) {
      return defaultFallback;
    }

    // Retorna únicamente el componente relativo seguro
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return defaultFallback;
  }
}

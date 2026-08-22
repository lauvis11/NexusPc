import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Content Security Policy (CSP)
 *
 * - default-src 'self'           → Base restrictiva: solo permite recursos del mismo origen.
 * - script-src                   → Scripts propios + inline/eval necesarios para Next.js App Router.
 *                                  En dev se usa 'unsafe-eval' para hot reload; en prod se omite.
 * - style-src                    → Estilos propios + inline (Next.js inyecta estilos) + Google Fonts CSS.
 * - font-src                     → Fuentes propias + Google Fonts (fonts.gstatic.com) para Montserrat.
 * - img-src                      → Imágenes propias + data:/blob: (previews) + Cloudinary + FakeStoreAPI.
 * - connect-src                  → Conexiones (fetch/XHR) al mismo origen + backend API + WebSocket en dev.
 * - frame-src 'none'             → Prohíbe iframes embebidos (no se usan).
 * - object-src 'none'            → Bloquea plugins (Flash, Java, etc.).
 * - base-uri 'self'              → Restringe <base> al mismo origen.
 * - form-action 'self'           → Restringe envíos de formulario al mismo origen.
 * - frame-ancestors 'none'       → Prohíbe que el sitio sea embebido en iframes (clickjacking).
 * - upgrade-insecure-requests    → Solo en prod: fuerza HTTPS en recursos mixtos.
 */

const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : "'unsafe-inline'"}`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  `img-src 'self' data: blob: https://res.cloudinary.com https://fakestoreapi.com`,
  `connect-src 'self' ${backendUrl} ${isDev ? "ws://localhost:* http://localhost:*" : ""}`,
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(!isDev ? ["upgrade-insecure-requests"] : []),
];

const ContentSecurityPolicy = cspDirectives.join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

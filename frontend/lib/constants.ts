const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const formattedUrl = rawApiUrl.startsWith("http://") || rawApiUrl.startsWith("https://")
  ? rawApiUrl
  : `https://${rawApiUrl}`;

// En entorno de servidor (Node.js SSR), si la URL apunta a localhost, usar 127.0.0.1
// para evitar que Node 18+ intente conectar a IPv6 (::1) cuando el backend escucha en IPv4.
export const API_URL =
  typeof window === "undefined"
    ? formattedUrl.replace("//localhost:", "//127.0.0.1:")
    : formattedUrl;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexuspc.com.ar";

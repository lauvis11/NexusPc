import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar cookies JWT del backend
  const accessToken = request.cookies.get("access-token");
  const refreshToken = request.cookies.get("refresh-token");
  const hasSession = Boolean(accessToken?.value || refreshToken?.value);

  // Rutas que requieren autenticación
  const isProtectedRoute =
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin");

  // Si intenta acceder a una ruta protegida sin cookie de sesión
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protección específica de rol para /admin a nivel Edge / Middleware
  if (pathname.startsWith("/admin") && accessToken?.value) {
    try {
      const parts = accessToken.value.split(".");
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        if (payload?.rol && payload.rol !== "ADMIN") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    } catch {
      // Si falla la decodificación, el AdminLayout validará con el backend
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/perfil/:path*", "/checkout/:path*", "/admin", "/admin/:path*"],
};

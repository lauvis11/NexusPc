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
    pathname.startsWith("/perfil") || pathname.startsWith("/checkout");

  // Si intenta acceder a una ruta protegida sin cookie de sesión
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/perfil/:path*", "/checkout/:path*"],
};

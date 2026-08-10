import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar cookies JWT del backend
  const accessToken = request.cookies.get("access-token");
  const refreshToken = request.cookies.get("refresh-token");
  const hasSession = !!accessToken || !!refreshToken;

  // Rutas que requieren autenticación
  const isProtectedRoute = pathname.startsWith("/perfil");

  // Rutas de autenticación pública (login/registro)
  const isAuthRoute = pathname === "/login" || pathname === "/registro";

  // Si intenta acceder a ruta protegida sin cookie de sesión
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si ya tiene sesión e intenta ir a /login o /register
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/perfil", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/perfil/:path*", "/login", "/registro"],
};

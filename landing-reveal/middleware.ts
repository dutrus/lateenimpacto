import { type NextRequest, NextResponse } from "next/server"

// Middleware para manejar las rutas
export function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const { pathname } = request.nextUrl

  // Si la ruta comienza con /[locale]/, redirigir a la versión sin locale
  if (pathname.match(/^\/[a-z]{2}\//)) {
    // Extraer la parte de la ruta después del locale
    const newPath = pathname.replace(/^\/[a-z]{2}\//, "/")
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  return NextResponse.next()
}

// Configurar el middleware para ejecutarse en todas las rutas
export const config = {
  matcher: [
    // Excluir archivos estáticos y API
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

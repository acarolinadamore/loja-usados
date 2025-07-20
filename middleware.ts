import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs" // Importa o pacote externo
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se o usuário tentar acessar /admin e não estiver logado, redireciona para /login
  if (req.nextUrl.pathname.startsWith("/admin") && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se o usuário tentar acessar /login e já estiver logado, redireciona para /admin
  if (req.nextUrl.pathname.startsWith("/login") && session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/admin"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/login"], // Aplica o middleware para /admin e /login
}

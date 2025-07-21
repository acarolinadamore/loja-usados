import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  console.log("--- Middleware Debug ---")
  console.log("Path acessado:", req.nextUrl.pathname)

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("Middleware: Erro ao obter sessão:", sessionError.message)
  } else {
    console.log("Middleware: Sessão encontrada?", !!session) // true se logado, false se não
    if (session) {
      console.log("Middleware: ID do usuário:", session.user.id)
      console.log("Middleware: Email do usuário:", session.user.email)
    } else {
      console.log("Middleware: Usuário NÃO logado.")
    }
  }

  // Se o usuário tentar acessar /admin e não estiver logado, redireciona para /login
  if (req.nextUrl.pathname.startsWith("/admin") && !session) {
    console.log(
      "Middleware: Redirecionando para /login (usuário não logado ou sessão inválida)"
    )
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se o usuário tentar acessar /login e já estiver logado, redireciona para /admin
  if (req.nextUrl.pathname.startsWith("/login") && session) {
    console.log("Middleware: Redirecionando para /admin (usuário já logado)")
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/admin"
    return NextResponse.redirect(redirectUrl)
  }

  console.log("Middleware: Continuando para a rota original.")
  return res
}

export const config = {
  matcher: ["/admin/:path*", "/login"], // Aplica o middleware para /admin e /login
}

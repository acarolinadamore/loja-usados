import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"

// Função para criar um cliente Supabase para uso em Server Components ou Route Handlers
// Este cliente precisa acessar os cookies da requisição e LÊ AS VARIAVEIS DE AMBIENTE DIRETAMENTE.
export const createSupabaseServerClient = (): SupabaseClient => {
  return createServerComponentClient({
    cookies,
  })
}

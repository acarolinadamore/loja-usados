"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs" // Importa o pacote externo
import type { SupabaseClient } from "@supabase/supabase-js"

type SupabaseContextType = SupabaseClient | undefined

const SupabaseContext = createContext<SupabaseContextType>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createClientComponentClient())

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}

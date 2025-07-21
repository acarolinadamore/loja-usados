"use client"

import { ShoppingBag, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation" // Import usePathname
import { supabase } from "@/lib/supabase/client" // Importa do cliente

export function Header() {
  const router = useRouter()
  const pathname = usePathname() // Get current pathname

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const showLogoutButton = pathname.startsWith("/admin") // Condition to show button

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Loja de Usados</h1>
          </div>
          {showLogoutButton && ( // Conditionally render the button
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

import { ShoppingBag } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Loja de Usados</h1>
          </div>
        </div>
      </div>
    </header>
  )
}

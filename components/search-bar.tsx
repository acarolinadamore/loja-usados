"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function SearchBar() {
  const [search, setSearch] = useState("")

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Buscar produtos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

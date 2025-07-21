"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  // Debounce the search term update to avoid too many re-renders/API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries())) // Get a new set of params
      if (searchTerm) {
        current.set("search", searchTerm)
      } else {
        current.delete("search")
      }
      const query = current.toString()
      router.replace(`/?${query}`) // Changed from router.push to router.replace
    }, 500) // 500ms debounce

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, router, searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Buscar produtos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

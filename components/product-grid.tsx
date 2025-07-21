"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import { supabase } from "@/lib/supabase/client" // Importa do cliente
import type { Product } from "@/lib/supabase/types" // Importa o tipo

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          categories (
            name
          )
        `
        )
        .eq("status", "Disponível")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Erro ao buscar produtos:", error)
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-200 animate-pulse rounded-lg h-80"
          ></div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Nenhum produto cadastrado ainda.
        </p>
        <p className="text-gray-400">Adicione seu primeiro produto!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

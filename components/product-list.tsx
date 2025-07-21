"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client" // Importa do cliente
import type { Product } from "@/lib/supabase/types" // Importa o tipo

export function ProductList() {
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

  const deleteProduct = async (id: number, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return

    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) {
        alert("Erro ao excluir produto: " + error.message)
        return
      }

      fetchProducts() // Recarregar lista
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "disponível":
        return "bg-green-100 text-green-800"
      case "vendido":
        return "bg-red-100 text-red-800"
      case "reservado":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando produtos...</div>
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum produto cadastrado ainda.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={
                    product.image_url || "/placeholder.svg?height=80&width=80"
                  }
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">
                    {product.categories?.name || "Sem categoria"}
                  </Badge>
                  <Badge variant="outline">{product.condition}</Badge>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-xl font-bold text-green-600 mb-2">
                  R$ {product.price.toFixed(2)}
                </div>
                <div className="flex gap-2">
                  <Link href={`/produto/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/editar/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProduct(product.id, product.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

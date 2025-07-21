"use client"

import { CardHeader } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { GripVertical, Check, Loader2 } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase/client"
import type { Product, FeaturedProductOrder } from "@/lib/supabase/types"

export function FeaturedProductManager() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [featuredOrder, setFeaturedOrder] = useState<FeaturedProductOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch all products (now selecting all fields to match Product type)
      let productQuery = supabase
        .from("products")
        .select("*") // Changed to select all fields
        .order("name")
      if (searchTerm) {
        productQuery = productQuery.ilike("name", `%${searchTerm}%`)
      }
      const { data: productsData, error: productsError } = await productQuery

      if (productsError) throw productsError

      // Fetch current featured order
      const { data: orderData, error: orderError } = await supabase
        .from("featured_products_order")
        .select(
          `
          *,
          products (
            name,
            image_url,
            images,
            cover_image_index
          )
        `
        )
        .order("order_index", { ascending: true })

      if (orderError) throw orderError

      setAllProducts(productsData || [])
      setFeaturedOrder(orderData || [])
    } catch (error: unknown) {
      // Explicitly type error as unknown
      let errorMessage = "Ocorreu um erro desconhecido."
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as any).message === "string"
      ) {
        errorMessage = (error as any).message
      }
      console.error("Erro ao buscar produtos/destaques:", errorMessage)
      alert("Erro ao carregar dados: " + errorMessage)
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleToggleFeatured = async (product: Product) => {
    console.log(
      "Toggle Featured: Iniciando para produto ID:",
      product.id,
      "Nome:",
      product.name
    )
    setSaving(true)
    try {
      const newFeaturedStatus = !product.is_featured
      console.log("Toggle Featured: Novo status:", newFeaturedStatus)

      // Update product's is_featured status
      const { error: updateProductError } = await supabase
        .from("products")
        .update({ is_featured: newFeaturedStatus })
        .eq("id", product.id)

      if (updateProductError) throw updateProductError
      console.log("Toggle Featured: Status do produto atualizado no DB.")

      if (newFeaturedStatus) {
        // Add to featured_products_order
        const newOrderIndex =
          featuredOrder.length > 0
            ? Math.max(...featuredOrder.map((item) => item.order_index)) + 1
            : 0
        console.log(
          "Toggle Featured: Adicionando à ordem de destaques com index:",
          newOrderIndex
        )
        const { error: insertOrderError } = await supabase
          .from("featured_products_order")
          .insert([{ product_id: product.id, order_index: newOrderIndex }])

        if (insertOrderError) throw insertOrderError
        console.log(
          "Toggle Featured: Produto adicionado à tabela de ordem de destaques."
        )
      } else {
        // Remove from featured_products_order
        console.log(
          "Toggle Featured: Removendo da ordem de destaques para produto ID:",
          product.id
        )
        const { error: deleteOrderError } = await supabase
          .from("featured_products_order")
          .delete()
          .eq("product_id", product.id)

        if (deleteOrderError) throw deleteOrderError
        console.log(
          "Toggle Featured: Produto removido da tabela de ordem de destaques."
        )
      }

      // Re-fetch all data to ensure consistency
      await fetchProducts()
      console.log("Toggle Featured: Dados re-buscados após alteração.")
    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro desconhecido."
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as any).message === "string"
      ) {
        errorMessage = (error as any).message
      }
      console.error("Erro ao atualizar destaque:", errorMessage)
      alert("Erro ao atualizar status de destaque: " + errorMessage)
    } finally {
      setSaving(false)
      console.log("Toggle Featured: Finalizado.")
    }
  }

  const handleReorder = async (newOrder: FeaturedProductOrder[]) => {
    console.log(
      "Reorder: Iniciando reordenação. Nova ordem proposta:",
      newOrder.map((item) => ({
        id: item.product_id,
        order_index: item.order_index,
      }))
    )
    setSaving(true)
    try {
      const updates = newOrder.map((item, index) => ({
        id: item.id,
        product_id: item.product_id, // Explicitly include product_id
        order_index: index, // Assign new index based on array position
      }))
      console.log("Reorder: Enviando updates para o Supabase:", updates)

      const { error } = await supabase
        .from("featured_products_order")
        .upsert(updates, { onConflict: "id" })

      if (error) throw error

      setFeaturedOrder(newOrder) // Update local state immediately
      console.log(
        "Reorder: Ordem salva com sucesso no DB e estado local atualizado."
      )
    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro desconhecido."
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as any).message === "string"
      ) {
        errorMessage = (error as any).message
      }
      console.error("Erro ao reordenar destaques:", errorMessage)
      alert("Erro ao salvar nova ordem: " + errorMessage)
      await fetchProducts() // Revert to last good state
    } finally {
      setSaving(false)
      console.log("Reorder: Finalizado.")
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    console.log("Drag Start: Iniciando arrasto do item no índice:", index)
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const draggedIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
    console.log(
      "Drop: Item arrastado do índice",
      draggedIndex,
      "para o índice",
      dropIndex
    )

    if (draggedIndex === dropIndex) return

    const newOrder = [...featuredOrder]
    const [draggedItem] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(dropIndex, 0, draggedItem)

    // Update order_index for all items in the new order
    const updatedOrderWithIndexes = newOrder.map((item, index) => ({
      ...item,
      order_index: index,
    }))

    console.log(
      "Drop: Nova ordem calculada (local):",
      updatedOrderWithIndexes.map((item) => ({
        id: item.product_id,
        order_index: item.order_index,
      }))
    )
    setFeaturedOrder(updatedOrderWithIndexes) // Optimistic update
    handleReorder(updatedOrderWithIndexes) // Persist to DB
  }

  const getProductImage = (
    product: Product | FeaturedProductOrder["products"]
  ) => {
    if (!product) return "/placeholder.svg?height=50&width=50"
    if (product.images && product.images.length > 0) {
      return (
        product.images[product.cover_image_index || 0] ||
        "/placeholder.svg?height=50&width=50"
      )
    }
    return product.image_url || "/placeholder.svg?height=50&width=50"
  }

  return (
    <div className="space-y-6">
      {/* Search and Toggle Featured Products */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="search-products" className="sr-only">
              Buscar produtos
            </Label>
            <Input
              id="search-products"
              placeholder="Buscar produtos para destacar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => fetchProducts()}
              disabled={loading || saving}
            >
              <Check className="h-4 w-4 mr-2" />
              Aplicar Filtro
            </Button>
          </div>
          {loading ? (
            <div className="text-center text-gray-500">
              Carregando produtos...
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {allProducts.length === 0 && (
                <p className="text-center text-gray-500">
                  Nenhum produto encontrado.
                </p>
              )}
              {allProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded-md overflow-hidden">
                      <Image
                        src={getProductImage(product) || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`featured-switch-${product.id}`}>
                      Destaque
                    </Label>
                    <Switch
                      id={`featured-switch-${product.id}`}
                      checked={product.is_featured}
                      onCheckedChange={() => handleToggleFeatured(product)}
                      disabled={saving}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Products Order */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">Ordem dos Destaques</h3>
          <p className="text-sm text-gray-500">
            Arraste e solte para reordenar. A ordem aqui define a exibição na
            página inicial.
          </p>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {saving && (
            <div className="flex items-center justify-center gap-2 text-blue-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Salvando ordem...</span>
            </div>
          )}
          {featuredOrder.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum produto em destaque. Marque produtos acima para
              adicioná-los aqui.
            </p>
          ) : (
            <div className="space-y-2">
              {featuredOrder.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="flex items-center gap-3 p-2 border rounded-md bg-white hover:bg-gray-50 cursor-grab"
                >
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div className="w-10 h-10 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={getProductImage(item.products) || "/placeholder.svg"}
                      alt={item.products?.name || "Produto"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="flex-1 font-medium">
                    {item.products?.name || "Produto Desconhecido"}
                  </span>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

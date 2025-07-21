"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import { supabase } from "@/lib/supabase/client"
import type { Product } from "@/lib/supabase/types"
import { useSearchParams } from "next/navigation"

export function ProductGrid() {
  console.log("ProductGrid component is rendering!") // <-- Este log deve aparecer
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log("ProductGrid useEffect triggered.") // <-- Este log deve aparecer
    const searchTerm = searchParams.get("search")
    const categoryIds =
      searchParams.get("categories")?.split(",").map(Number) || []

    const fetchProducts = async () => {
      setLoading(true)
      try {
        // 1. Fetch Featured Products
        let featuredQuery = supabase
          .from("products")
          .select(
            `
            *,
            categories (
              name
            ),
            featured_products_order (
              order_index
            )
          `
          )
          .eq("status", "Disponível")
          .eq("is_featured", true) // Ensure only featured products are fetched here

        if (searchTerm) {
          featuredQuery = featuredQuery.or(
            `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
          )
        }
        if (categoryIds.length > 0) {
          featuredQuery = featuredQuery.in("category_id", categoryIds)
        }

        const { data: featuredData, error: featuredError } = await featuredQuery

        if (featuredError) throw featuredError

        console.log("Featured Data fetched:", featuredData) // Debugging: Check raw featured data

        // Sort featured products by their order_index
        const sortedFeatured = (featuredData || []).sort((a, b) => {
          // Ensure featured_products_order is an array and has elements
          const aIndex =
            a.featured_products_order?.order_index ?? Number.POSITIVE_INFINITY
          const bIndex =
            b.featured_products_order?.order_index ?? Number.POSITIVE_INFINITY
          return aIndex - bIndex
        })

        console.log("Sorted Featured Products:", sortedFeatured) // Debugging: Check sorted featured data

        // 2. Fetch Non-Featured Products
        let nonFeaturedQuery = supabase
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
          .eq("is_featured", false) // Ensure only non-featured products are fetched here

        if (searchTerm) {
          nonFeaturedQuery = nonFeaturedQuery.or(
            `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
          )
        }
        if (categoryIds.length > 0) {
          nonFeaturedQuery = nonFeaturedQuery.in("category_id", categoryIds)
        }

        nonFeaturedQuery = nonFeaturedQuery.order("created_at", {
          ascending: false,
        })

        const { data: nonFeaturedData, error: nonFeaturedError } =
          await nonFeaturedQuery

        if (nonFeaturedError) throw nonFeaturedError

        console.log("Non-Featured Data fetched:", nonFeaturedData) // Debugging: Check non-featured data

        // Combine featured and non-featured products
        setProducts([...sortedFeatured, ...(nonFeaturedData || [])])
      } catch (error) {
        console.error("Erro ao buscar produtos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams.toString()]) // Re-fetch when search params change

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

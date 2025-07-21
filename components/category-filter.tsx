"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

interface CategoryWithCount {
  id: number
  name: string
  count: number
}

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSelectedCategories = searchParams.get("categories")
    ? searchParams.get("categories")!.split(",").map(Number)
    : []
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialSelectedCategories
  )

  useEffect(() => {
    fetchCategoriesWithCount()
  }, [])

  // Effect to update URL when selectedCategories change
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (selectedCategories.length > 0) {
      current.set("categories", selectedCategories.join(","))
    } else {
      current.delete("categories")
    }
    const query = current.toString()
    router.replace(`/?${query}`) // Changed from router.push to router.replace
  }, [selectedCategories, router, searchParams])

  const fetchCategoriesWithCount = async () => {
    try {
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, name")
        .order("name")

      if (!categoriesData) return

      const categoriesWithCount = await Promise.all(
        categoriesData.map(async (category) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)
            .eq("status", "Disponível")

          return {
            ...category,
            count: count || 0,
          }
        })
      )

      const filteredCategories = categoriesWithCount.filter(
        (category) => category.count > 0
      )

      setCategories(filteredCategories)
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
    }
  }

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setSelectedCategories((prev) => {
      if (checked) {
        return [...prev, categoryId]
      } else {
        return prev.filter((id) => id !== categoryId)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categorias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-3">
            <Checkbox
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={(checked) =>
                handleCategoryChange(category.id, checked as boolean)
              }
              className="mt-0.5"
            />
            <Label
              htmlFor={`category-${category.id}`}
              className="flex-1 cursor-pointer flex items-center justify-between leading-none"
            >
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {category.name}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                ({category.count})
              </span>
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

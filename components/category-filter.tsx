"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"

interface CategoryWithCount {
  id: number
  name: string
  count: number
}

export function CategoryFilter() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  useEffect(() => {
    fetchCategoriesWithCount()
  }, [])

  const fetchCategoriesWithCount = async () => {
    try {
      // Buscar categorias com contagem real de produtos
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, name")
        .order("name")

      if (!categoriesData) return

      // Para cada categoria, contar produtos disponíveis
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

      // Filter out categories with 0 products
      const filteredCategories = categoriesWithCount.filter(
        (category) => category.count > 0
      )

      setCategories(filteredCategories)
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
    }
  }

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      )
    }
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

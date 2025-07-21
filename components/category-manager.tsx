"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Check, X } from "lucide-react"
import { supabase } from "@/lib/supabase/client" // Importa do cliente
import type { Category } from "@/lib/supabase/types" // Importa o tipo

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name")

    if (data) setCategories(data)
  }

  const addCategory = async () => {
    if (!newCategoryName.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("categories")
        .insert([{ name: newCategoryName.trim() }])

      if (error) {
        alert("Erro ao adicionar categoria: " + error.message)
        return
      }

      setNewCategoryName("")
      fetchCategories()
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateCategory = async (id: number) => {
    if (!editingName.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("categories")
        .update({ name: editingName.trim() })
        .eq("id", id)

      if (error) {
        alert("Erro ao atualizar categoria: " + error.message)
        return
      }

      setEditingId(null)
      setEditingName("")
      fetchCategories()
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id: number, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${name}"?`))
      return

    setLoading(true)
    try {
      // Verificar se há produtos nesta categoria
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", id)

      if (count && count > 0) {
        alert(`Não é possível excluir. Há ${count} produto(s) nesta categoria.`)
        setLoading(false)
        return
      }

      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) {
        alert("Erro ao excluir categoria: " + error.message)
        return
      }

      fetchCategories()
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  return (
    <div className="space-y-6">
      {/* Adicionar nova categoria */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="new-category">Nova Categoria</Label>
              <Input
                id="new-category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nome da categoria"
                onKeyPress={(e) => e.key === "Enter" && addCategory()}
              />
            </div>
            <Button
              onClick={addCategory}
              disabled={loading || !newCategoryName.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de categorias */}
      <div className="space-y-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {editingId === category.id ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && updateCategory(category.id)
                        }
                        className="max-w-xs"
                      />
                      <Button
                        size="sm"
                        onClick={() => updateCategory(category.id)}
                        disabled={loading}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary">ID: {category.id}</Badge>
                    </div>
                  )}
                </div>

                {editingId !== category.id && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCategory(category.id, category.name)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

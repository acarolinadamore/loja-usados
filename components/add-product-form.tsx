"use client"

import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase, uploadMultipleImages, type Category } from "@/lib/supabase"
import { MultiImageUpload } from "@/components/multi-image-upload"

const conditions = ["Novo", "Muito Bom", "Bom", "Regular"]

export function AddProductForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    condition: "",
    category_id: "",
    whatsapp: "",
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [coverIndex, setCoverIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name")
    if (data) setCategories(data)
  }

  const handleImagesChange = (images: File[], coverIdx: number) => {
    setSelectedImages(images)
    setCoverIndex(coverIdx)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Inserir produto primeiro
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: formData.name,
            description: formData.description,
            price: Number.parseFloat(formData.price),
            condition: formData.condition,
            category_id: Number.parseInt(formData.category_id),
            whatsapp: formData.whatsapp,
            status: "Disponível",
          },
        ])
        .select()

      if (error) {
        console.error("Erro ao salvar produto:", error)
        alert("Erro ao salvar produto: " + error.message)
        return
      }

      const productId = data[0].id
      console.log("Produto criado com ID:", productId)

      // 2. Upload das imagens se houver
      if (selectedImages.length > 0) {
        console.log(`Fazendo upload de ${selectedImages.length} imagens...`)
        const imageUrls = await uploadMultipleImages(selectedImages, productId)

        if (imageUrls.length > 0) {
          console.log("Atualizando produto com URLs das imagens:", imageUrls)
          // Atualizar produto com URLs das imagens
          const { error: updateError } = await supabase
            .from("products")
            .update({
              images: imageUrls,
              image_url: imageUrls[coverIndex] || imageUrls[0], // Imagem de capa
              cover_image_index: coverIndex,
            })
            .eq("id", productId)

          if (updateError) {
            console.error("Erro ao atualizar imagens:", updateError)
          }
        }
      }

      alert("Produto cadastrado com sucesso!")

      // Limpar formulário
      setFormData({
        name: "",
        description: "",
        price: "",
        condition: "",
        category_id: "",
        whatsapp: "",
      })
      setSelectedImages([])
      setCoverIndex(0)
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro inesperado ao salvar produto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Livro O Alquimista"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                setFormData({ ...formData, category_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition">Condição *</Label>
            <Select
              value={formData.condition}
              onValueChange={(value) =>
                setFormData({ ...formData, condition: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a condição" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <Label htmlFor="whatsapp">WhatsApp (apenas números)</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp: e.target.value })
              }
              placeholder="11999999999"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descreva o produto, estado de conservação, detalhes importantes..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label>Fotos do Produto (até 8 imagens)</Label>
            <MultiImageUpload
              onImagesChange={handleImagesChange}
              maxImages={8}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Cadastrar Produto"}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
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
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { supabase, uploadMultipleImages } from "@/lib/supabase/client" // Importa do cliente
import type { Category, Product } from "@/lib/supabase/types" // Importa os tipos
import { MultiImageUpload } from "./multi-image-upload"
import Link from "next/link"

const conditions = [
  "Novo",
  "Em estado de novo",
  "Em ótimo estado",
  "Em bom estado",
  "Usado",
]

interface EditProductFormProps {
  product: Product
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    condition: product.condition,
    category_id: product.category_id.toString(),
    whatsapp: product.whatsapp || "",
    status: product.status,
    location: product.location || "",
    observation: product.observation || "",
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [coverIndex, setCoverIndex] = useState(product.cover_image_index || 0)
  const [loading, setLoading] = useState(false)

  const existingImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : []

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
      let finalImages = existingImages
      const finalCoverIndex = coverIndex

      if (selectedImages.length > 0) {
        console.log(
          `Fazendo upload de ${selectedImages.length} novas imagens...`
        )
        const newImageUrls = await uploadMultipleImages(
          selectedImages,
          product.id
        )

        if (newImageUrls.length > 0) {
          finalImages = [...existingImages, ...newImageUrls]
          console.log("Imagens finais:", finalImages)
        }
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          condition: formData.condition,
          category_id: Number.parseInt(formData.category_id),
          whatsapp: formData.whatsapp,
          status: formData.status,
          location: formData.location,
          observation: formData.observation,
          images: finalImages,
          image_url: finalImages[finalCoverIndex] || finalImages[0],
          cover_image_index: finalCoverIndex,
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id)

      if (error) {
        console.error("Erro ao atualizar produto:", error)
        alert("Erro ao atualizar produto: " + error.message)
        return
      }

      alert("Produto atualizado com sucesso!")
      router.push("/admin")
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro inesperado ao atualizar produto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Admin
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
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
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disponível">Disponível</SelectItem>
                      <SelectItem value="Vendido">Vendido</SelectItem>
                      <SelectItem value="Reservado">Reservado</SelectItem>
                    </SelectContent>
                  </Select>
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

                <div>
                  <Label htmlFor="location">Buscar no Local</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Ex: Condomínio Bahamas, Bloco G 302"
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
                  <Label htmlFor="observation">Observação</Label>
                  <Textarea
                    id="observation"
                    value={formData.observation}
                    onChange={(e) =>
                      setFormData({ ...formData, observation: e.target.value })
                    }
                    placeholder="Informações adicionais sobre o produto ou venda..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Fotos do Produto</Label>
                  <div className="text-sm text-gray-600 mb-2">
                    {existingImages.length > 0 && (
                      <p>
                        Produto atual: {existingImages.length} imagem
                        {existingImages.length !== 1 ? "s" : ""}
                      </p>
                    )}
                    <p>
                      Adicione novas imagens abaixo (serão adicionadas às
                      existentes)
                    </p>
                  </div>
                  <MultiImageUpload
                    onImagesChange={handleImagesChange}
                    maxImages={8 - existingImages.length}
                    existingImages={existingImages}
                    existingCoverIndex={product.cover_image_index || 0}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Atualizar Produto"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import React from "react"

import type { ReactElement } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Star, StarOff, GripVertical } from "lucide-react"

interface ImageFile {
  file: File
  preview: string
  id: string
  isCover: boolean
}

interface MultiImageUploadProps {
  onImagesChange: (images: File[], coverIndex: number) => void
  maxImages?: number
  existingImages?: string[]
  existingCoverIndex?: number
}

export function MultiImageUpload({
  onImagesChange,
  maxImages = 8,
  existingImages = [],
  existingCoverIndex = 0,
}: MultiImageUploadProps): ReactElement {
  const [images, setImages] = useState<ImageFile[]>([])
  const [coverIndex, setCoverIndex] = useState(existingCoverIndex)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Inicializar com imagens existentes
  React.useEffect(() => {
    if (existingImages.length > 0 && images.length === 0) {
      const existingImageFiles: ImageFile[] = existingImages.map(
        (url, index) => ({
          file: null as any, // Para imagens existentes, não temos o File
          preview: url,
          id: `existing-${index}`,
          isCover: index === existingCoverIndex,
        })
      )
      setImages(existingImageFiles)
    }
  }, [existingImages, existingCoverIndex, images.length])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (images.length + files.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`)
      return
    }

    const newImages: ImageFile[] = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `new-${Date.now()}-${index}`,
      isCover: images.length === 0 && index === 0, // Primeira imagem é capa se não há outras
    }))

    const updatedImages = [...images, ...newImages]
    setImages(updatedImages)

    // Notificar mudanças
    const fileList = updatedImages
      .filter((img) => img.file)
      .map((img) => img.file)
    const newCoverIndex = updatedImages.findIndex((img) => img.isCover)
    onImagesChange(fileList, newCoverIndex >= 0 ? newCoverIndex : 0)
  }

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)

    // Se removeu a capa, definir a primeira como nova capa
    if (images[indexToRemove]?.isCover && updatedImages.length > 0) {
      updatedImages[0].isCover = true
      setCoverIndex(0)
    } else if (indexToRemove < coverIndex) {
      setCoverIndex(coverIndex - 1)
    }

    setImages(updatedImages)

    const fileList = updatedImages
      .filter((img) => img.file)
      .map((img) => img.file)
    const newCoverIndex = updatedImages.findIndex((img) => img.isCover)
    onImagesChange(fileList, newCoverIndex >= 0 ? newCoverIndex : 0)
  }

  const setCover = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isCover: i === index,
    }))

    setImages(updatedImages)
    setCoverIndex(index)

    const fileList = updatedImages
      .filter((img) => img.file)
      .map((img) => img.file)
    onImagesChange(fileList, index)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) return

    const updatedImages = [...images]
    const draggedImage = updatedImages[draggedIndex]

    // Remove da posição original
    updatedImages.splice(draggedIndex, 1)
    // Insere na nova posição
    updatedImages.splice(dropIndex, 0, draggedImage)

    setImages(updatedImages)
    setDraggedIndex(null)

    const fileList = updatedImages
      .filter((img) => img.file)
      .map((img) => img.file)
    const newCoverIndex = updatedImages.findIndex((img) => img.isCover)
    onImagesChange(fileList, newCoverIndex >= 0 ? newCoverIndex : 0)
  }

  const triggerFileInput = () => {
    const fileInput = document.getElementById(
      "multi-image-upload"
    ) as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card
          className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={triggerFileInput}
        >
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Adicione até {maxImages} imagens ({images.length}/{maxImages})
            </p>
            <p className="text-xs text-gray-500 mb-2">
              Arraste para reordenar • Clique na estrela para definir capa
            </p>
            <Button type="button" variant="outline" size="sm">
              Escolher Imagens
            </Button>
          </CardContent>
        </Card>
      )}

      <input
        id="multi-image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300">
                <img
                  src={image.preview || "/placeholder.svg"}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay com controles */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={image.isCover ? "default" : "secondary"}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCover(index)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      {image.isCover ? (
                        <Star className="h-4 w-4" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Badge de capa */}
                {image.isCover && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                    Capa
                  </Badge>
                )}

                {/* Indicador de posição */}
                <Badge
                  variant="secondary"
                  className="absolute top-2 right-2 text-xs"
                >
                  {index + 1}
                </Badge>

                {/* Handle para arrastar */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instruções */}
      {images.length > 0 && (
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            • <strong>Capa:</strong> Clique na estrela para definir a imagem
            principal
          </p>
          <p>
            • <strong>Reordenar:</strong> Arraste as imagens para reorganizar
          </p>
          <p>
            • <strong>Remover:</strong> Clique no X para excluir uma imagem
          </p>
        </div>
      )}
    </div>
  )
}

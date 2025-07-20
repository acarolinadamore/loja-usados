"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void
  maxImages?: number
}

export function ImageUpload({ onImagesChange, maxImages = 8 }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (images.length + files.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`)
      return
    }

    const newImages = [...images, ...files]
    setImages(newImages)
    onImagesChange(newImages)

    // Criar previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)

    setImages(newImages)
    setPreviews(newPreviews)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Adicione até {maxImages} imagens ({images.length}/{maxImages})
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Button type="button" variant="outline" size="sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Escolher Imagens
              </Button>
            </label>
          </CardContent>
        </Card>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

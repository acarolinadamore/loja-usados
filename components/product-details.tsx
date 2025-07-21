"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  ArrowLeft,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Info,
} from "lucide-react"
import type { Product } from "@/lib/supabase/types" // Importa o tipo

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : ["/placeholder.svg?height=400&width=400"]

  const handleWhatsApp = () => {
    const message = `Olá! Tenho interesse no produto: ${
      product.name
    } - R$ ${product.price.toFixed(2)}`
    const whatsapp = product.whatsapp || "11999999999"
    const url = `https://wa.me/55${whatsapp}?text=${encodeURIComponent(
      message
    )}`
    window.open(url, "_blank")
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "novo":
        return "bg-green-100 text-green-800"
      case "muito bom":
        return "bg-blue-100 text-blue-800"
      case "bom":
        return "bg-yellow-100 text-yellow-800"
      case "regular":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const nextImageInModal = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImageInModal = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const googleMapsEmbedUrl = product.location
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        product.location
      )}&output=embed`
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Catálogo
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <Dialog
                open={isImageModalOpen}
                onOpenChange={setIsImageModalOpen}
              >
                <DialogTrigger asChild>
                  <div className="aspect-square relative cursor-zoom-in group">
                    <Image
                      src={images[currentImageIndex] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 text-white px-3 py-1 rounded text-sm">
                        Clique para ampliar
                      </div>
                    </div>

                    {images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                          onClick={(e) => {
                            e.stopPropagation()
                            prevImage()
                          }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                          onClick={(e) => {
                            e.stopPropagation()
                            nextImage()
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}

                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">
                        {product.categories?.name || "Sem categoria"}
                      </Badge>
                    </div>
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black border-none">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                      onClick={() => setIsImageModalOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </Button>

                    <Image
                      src={images[currentImageIndex] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />

                    {images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
                          onClick={prevImageInModal}
                        >
                          <ChevronLeft className="h-8 w-8" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
                          onClick={nextImageInModal}
                        >
                          <ChevronRight className="h-8 w-8" />
                        </Button>

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </Card>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {currentImageIndex === index && (
                      <div className="absolute inset-0 bg-blue-500/20"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-green-600">
                  R$ {product.price.toFixed(2)}
                </span>
                <Badge
                  className={getConditionColor(product.condition)}
                  variant="secondary"
                >
                  {product.condition}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    product.status === "Disponível"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }
                >
                  {product.status}
                </Badge>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">Descrição</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">Informações</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoria:</span>
                    <span className="font-medium">
                      {product.categories?.name || "Não informado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condição:</span>
                    <span className="font-medium">{product.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{product.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Publicado em:</span>
                    <span className="font-medium">
                      {new Date(product.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {product.status === "Disponível" && (
              <Button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Tenho Interesse - WhatsApp
              </Button>
            )}
          </div>
        </div>

        {product.location && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-600" />
                Buscar no Local
              </h3>
              <p className="text-gray-700 mb-4">{product.location}</p>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={googleMapsEmbedUrl || ""}
                ></iframe>
              </div>
            </CardContent>
          </Card>
        )}

        {product.observation && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-gray-600" />
                Observação
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.observation}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

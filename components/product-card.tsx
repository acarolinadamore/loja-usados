"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import type { Product } from "@/lib/supabase/types"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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

  return (
    <Link href={`/produto/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square relative">
          <Image
            src={product.image_url || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs">
              {product.categories?.name || "Sem categoria"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-green-600">
              R$ {product.price.toFixed(2)}
            </span>
            <Badge className={getConditionColor(product.condition)}>
              {product.condition}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleWhatsApp()
            }}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Tenho Interesse
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

// Tipos para TypeScript
export interface Product {
  id: number
  name: string
  description: string
  price: number
  condition: string
  category_id: number
  image_url?: string
  images?: string[]
  cover_image_index?: number
  whatsapp?: string
  status: string
  created_at: string
  updated_at: string
  categories?: {
    name: string
  }
  location?: string // Campo para localização/endereço
  observation?: string // Campo para observações
  is_featured?: boolean // Novo campo para produtos em destaque
  featured_products_order?: {
    order_index: number
  } // Adicionado para a relação de ordem
}

export interface Category {
  id: number
  name: string
  created_at: string
}

export interface FeaturedProductOrder {
  id: number
  product_id: number
  order_index: number
  created_at: string
  updated_at: string
  products?: {
    // Optional: to fetch product details with the order
    name: string
    image_url?: string
    images?: string[]
    cover_image_index?: number
  }
}

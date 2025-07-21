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
}

export interface Category {
  id: number
  name: string
  created_at: string
}

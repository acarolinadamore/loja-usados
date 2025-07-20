import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  observation?: string // Adicionado: Campo para observações
}

export interface Category {
  id: number
  name: string
  created_at: string
}

// Função para upload de múltiplas imagens
export const uploadMultipleImages = async (
  files: File[],
  productId: number
): Promise<string[]> => {
  const uploadedUrls: string[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileExt = file.name.split(".").pop()
    const fileName = `${productId}_${Date.now()}_${i}.${fileExt}`
    const filePath = `products/${fileName}`

    try {
      console.log(`Fazendo upload ${i + 1}/${files.length}:`, filePath)

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (error) {
        console.error(`Erro no upload ${i + 1}:`, error)
        continue
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath)
      uploadedUrls.push(urlData.publicUrl)

      console.log(`Upload ${i + 1} concluído:`, urlData.publicUrl)
    } catch (error) {
      console.error(`Erro no upload ${i + 1}:`, error)
    }
  }

  return uploadedUrls
}

// Função para upload de imagem única (compatibilidade)
export const uploadImage = async (
  file: File,
  productId: number
): Promise<string | null> => {
  const urls = await uploadMultipleImages([file], productId)
  return urls.length > 0 ? urls[0] : null
}

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { SupabaseClient } from "@supabase/supabase-js"

// Cliente Supabase para uso em Client Components (no navegador)
// Este cliente gerencia automaticamente os cookies do navegador.
// Garante que as variáveis de ambiente são lidas corretamente.
export const supabase: SupabaseClient = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})

// Função para upload de múltiplas imagens
export const uploadMultipleImages = async (
  files: File[],
  productId: number
): Promise<string[]> => {
  const uploadedUrls: string[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileExt = file.name.split(".").pop()
    const fileName = `products/${productId}_${Date.now()}_${i}.${fileExt}` // Caminho completo no bucket

    try {
      console.log(`Fazendo upload ${i + 1}/${files.length}:`, fileName)

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (error) {
        console.error(`Erro no upload ${i + 1}:`, error)
        continue
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName)
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

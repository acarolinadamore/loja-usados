import { ProductDetails } from "@/components/product-details"
import { createSupabaseServerClient } from "@/lib/supabase/server" // Importa do servidor
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = createSupabaseServerClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        name
      )
    `
    )
    .eq("id", id)
    .single()

  if (error || !product) {
    notFound()
  }

  return <ProductDetails product={product} />
}

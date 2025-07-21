import { EditProductForm } from "@/components/edit-product-form"
import { createSupabaseServerClient } from "@/lib/supabase/server" // Importa do servidor
import { notFound } from "next/navigation"

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editar Produto
          </h1>
          <p className="text-gray-600">Atualize as informações do produto</p>
        </div>

        <EditProductForm product={product} />
      </div>
    </div>
  )
}

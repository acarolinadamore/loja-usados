import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { SearchBar } from "@/components/search-bar"
import { Header } from "@/components/header" // Re-add Header import

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header /> {/* Re-add Header component */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-gray-600">
            Encontre produtos usados em ótimo estado com preços especiais
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64">
            <div className="space-y-6">
              <SearchBar />
              <CategoryFilter />
            </div>
          </aside>

          <div className="flex-1">
            <ProductGrid />
          </div>
        </div>
      </main>
    </div>
  )
}

import { AddProductForm } from "@/components/add-product-form"
import { ProductList } from "@/components/product-list"
import { CategoryManager } from "@/components/category-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administração</h1>
          <p className="text-gray-600">Gerencie seus produtos e categorias</p>
        </div>

        <Tabs defaultValue="add" className="space-y-6">
          <TabsList>
            <TabsTrigger value="add">Adicionar Produto</TabsTrigger>
            <TabsTrigger value="list">Listar Produtos</TabsTrigger>
            <TabsTrigger value="categories">Gerenciar Categorias</TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Novo Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <AddProductForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

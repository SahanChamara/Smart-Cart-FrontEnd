"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ProductDto } from "@/types/product"
import { useState } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductDialog } from "@/components/product-dialog"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null)

  // Mock data for demonstration
  const [products, setProducts] = useState<ProductDto[]>([
    {
      id: 1,
      name: "Milk 1L",
      barcode: "8901234567890",
      category: "Dairy",
      quantity: 50,
      costPrice: 120,
      sellingPrice: 150,
      expiryDate: new Date(2023, 11, 31).toISOString(),
      supplierId: 1,
    },
    {
      id: 2,
      name: "Bread",
      barcode: "8901234567891",
      category: "Bakery",
      quantity: 30,
      costPrice: 80,
      sellingPrice: 100,
      expiryDate: new Date(2023, 11, 25).toISOString(),
      supplierId: 2,
    },
    {
      id: 3,
      name: "Coca Cola 1.5L",
      barcode: "8901234567892",
      category: "Beverages",
      quantity: 100,
      costPrice: 90,
      sellingPrice: 120,
      expiryDate: new Date(2024, 5, 30).toISOString(),
      supplierId: 3,
    },
    {
      id: 4,
      name: "Rice 5kg",
      barcode: "8901234567893",
      category: "Grains",
      quantity: 25,
      costPrice: 500,
      sellingPrice: 550,
      expiryDate: new Date(2024, 11, 31).toISOString(),
      supplierId: 1,
    },
    {
      id: 5,
      name: "Chocolate Bar",
      barcode: "8901234567894",
      category: "Confectionery",
      quantity: 75,
      costPrice: 50,
      sellingPrice: 80,
      expiryDate: new Date(2023, 11, 31).toISOString(),
      supplierId: 2,
    },
  ])

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm),
    )
    .filter((product) => categoryFilter === "all" || product.category === categoryFilter)

  const handleAddEdit = (product: ProductDto | null) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleSaveProduct = (product: ProductDto) => {
    if (product.id) {
      // Update existing product
      setProducts(products.map((p) => (p.id === product.id ? product : p)))
    } else {
      // Add new product
      const newProduct = {
        ...product,
        id: Math.max(...products.map((p) => p.id || 0)) + 1,
      }
      setProducts([...products, newProduct])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button onClick={() => handleAddEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>Manage your product inventory, prices, and stock levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Barcode</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{product.barcode}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${product.quantity < 10 ? "text-destructive" : ""}`}>
                            {product.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">${product.sellingPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleAddEdit(product)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id!)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  )
}

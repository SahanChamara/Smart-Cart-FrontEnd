"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ProductDto } from "@/types/product"
import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductDialog } from "@/components/product-dialog"
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../redux/store'
import { getAllProductsAPI, addProductAPI, updateProductAPI, deleteProductAPI } from '../../../redux/features/productSlice'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const { productsData, loading, error } = useSelector((state: RootState) => state.product as {
    productsData: ProductDto[];
    loading: boolean;
    error: string | null;
  })

  useEffect(() => {
    dispatch(getAllProductsAPI())
  }, [dispatch])

  const categories = ["all", ...Array.from(new Set(productsData.map((p: { category: any }) => p.category)))]

  const filteredProducts = productsData
    .filter(
      (product: { name: string; barcode: string | string[] }) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm),
    )
    .filter((product: { category: string }) => categoryFilter === "all" || product.category === categoryFilter)

  const handleAddEdit = (product: ProductDto | null) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    dispatch(deleteProductAPI(id))
  }

  const handleSaveProduct = (product: ProductDto) => {
    if (product.id) {
      dispatch(updateProductAPI(product))
    } else {
      dispatch(addProductAPI(product))
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
                    <SelectItem key={category as string} value={category as string}>
                      {(category as string).charAt(0).toUpperCase() + (category as string).slice(1)}
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product: ProductDto | null) =>
                      product ? (
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
                      ) : null
                    )
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
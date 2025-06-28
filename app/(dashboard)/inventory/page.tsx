"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { InventoryLogDto } from "@/types/inventory"
import type { ProductDto } from "@/types/product"
import { useEffect, useState } from "react"
import { Search, Plus, ArrowUp, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryAdjustmentDialog } from "@/components/inventory-adjustment-dialog"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { RootState } from "@/redux/store"
import { getAllProductsAPI } from "@/redux/features/productSlice"

export default function InventoryPage() {
  const dispatch = useAppDispatch();
  const { productsData, loading, error } = useAppSelector((state: RootState) => state.product as {
    productsData: ProductDto[];
    loading: boolean;
    error: string | null;
  });

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null)

  useEffect(() => {
    dispatch(getAllProductsAPI());
  }, [dispatch]);

  // Mock data for demonstration
  /* const [products] = useState<ProductDto[]>([
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
      quantity: 5,
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
      quantity: 0,
      costPrice: 50,
      sellingPrice: 80,
      expiryDate: new Date(2023, 11, 31).toISOString(),
      supplierId: 2,
    },
  ]) */

  const [inventoryLogs] = useState<InventoryLogDto[]>([
    {
      id: 1,
      productId: 1,
      changeAmount: 50,
      reason: "Initial stock",
      timestamp: new Date(2023, 10, 1, 9, 30).toISOString(),
      updatedById: 1,
    },
    {
      id: 2,
      productId: 2,
      changeAmount: 30,
      reason: "Initial stock",
      timestamp: new Date(2023, 10, 1, 9, 45).toISOString(),
      updatedById: 1,
    },
    {
      id: 3,
      productId: 3,
      changeAmount: 100,
      reason: "Initial stock",
      timestamp: new Date(2023, 10, 1, 10, 0).toISOString(),
      updatedById: 1,
    },
    {
      id: 4,
      productId: 2,
      changeAmount: -25,
      reason: "Sales",
      timestamp: new Date(2023, 10, 15, 14, 30).toISOString(),
      updatedById: 2,
    },
    {
      id: 5,
      productId: 5,
      changeAmount: 75,
      reason: "New shipment",
      timestamp: new Date(2023, 10, 20, 11, 15).toISOString(),
      updatedById: 1,
    },
    {
      id: 6,
      productId: 5,
      changeAmount: -75,
      reason: "Expired products",
      timestamp: new Date(2023, 11, 30, 16, 0).toISOString(),
      updatedById: 3,
    },
  ])

  const categories = ["all", ...Array.from(new Set(productsData.map((p) => p.category)))]

  const filteredProducts = productsData
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm),
    )
    .filter((product) => categoryFilter === "all" || product.category === categoryFilter)
    .filter((product) => {
      if (stockFilter === "all") return true
      if (stockFilter === "low" && product.quantity <= 10) return true
      if (stockFilter === "out" && product.quantity === 0) return true
      if (stockFilter === "available" && product.quantity > 0) return true
      return false
    })

  const filteredLogs = inventoryLogs
    .filter((log) => {
      if (searchTerm) {
        const product = productsData.find((p) => p.id === log.productId)
        return product?.name.toLowerCase().includes(searchTerm.toLowerCase())
      }
      return true
    })
    .filter((log) => {
      if (!dateRange?.from) return true
      const logDate = new Date(log.timestamp)
      if (dateRange.to) {
        return logDate >= dateRange.from && logDate <= dateRange.to
      }
      return logDate.toDateString() === dateRange.from.toDateString()
    })

  const handleAdjustInventory = (product: ProductDto) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleSaveAdjustment = (productId: number, changeAmount: number, reason: string) => {
    // In a real app, this would call an API to update the inventory
    console.log(`Adjusting inventory for product ${productId}: ${changeAmount} units. Reason: ${reason}`)
    setIsDialogOpen(false)
  }

  const getProductName = (productId: number) => {
    return productsData.find((p) => p.id === productId)?.name || "Unknown Product"
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adjust Inventory
        </Button>
      </div>

      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stock">Current Stock</TabsTrigger>
          <TabsTrigger value="logs">Inventory Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Stock Levels</CardTitle>
              <CardDescription>Monitor and manage your current inventory levels.</CardDescription>
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
                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Stock Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock</SelectItem>
                      <SelectItem value="low">Low Stock (≤10)</SelectItem>
                      <SelectItem value="out">Out of Stock</SelectItem>
                      <SelectItem value="available">In Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="hidden md:table-cell">Barcode</TableHead>
                        <TableHead className="text-right">Stock Level</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading === true ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            loading
                          </TableCell>
                        </TableRow>
                      ) : (filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
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
                              <div className="flex items-center justify-end gap-2">
                                <Badge
                                  variant={
                                    product.quantity === 0
                                      ? "destructive"
                                      : product.quantity <= 10
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {product.quantity === 0
                                    ? "Out of Stock"
                                    : product.quantity <= 10
                                      ? "Low Stock"
                                      : "In Stock"}
                                </Badge>
                                <span className="font-medium">{product.quantity}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAdjustInventory(product)}
                                className="h-8"
                              >
                                Adjust
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ))}
                      
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Logs</CardTitle>
              <CardDescription>Track all inventory changes and adjustments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by product..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DatePickerWithRange
                    className="w-full sm:w-[300px]"
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                  />
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead className="hidden md:table-cell">Reason</TableHead>
                        <TableHead className="hidden md:table-cell">Updated By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No inventory logs found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{format(new Date(log.timestamp), "PPp")}</TableCell>
                            <TableCell className="font-medium">{getProductName(log.productId)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {log.changeAmount > 0 ? (
                                  <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                                ) : (
                                  <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                                )}
                                {log.changeAmount > 0 ? "+" : ""}
                                {log.changeAmount}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{log.reason}</TableCell>
                            <TableCell className="hidden md:table-cell">User ID: {log.updatedById}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <InventoryAdjustmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onSave={handleSaveAdjustment}
        products={productsData}
      />
    </div>
  )
}

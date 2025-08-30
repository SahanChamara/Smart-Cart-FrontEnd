"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ProductDto } from "@/types/product"
import type { SaleDto, SaleItemDto } from "@/types/sale"
import type { InventoryLogDto } from "@/types/inventory"
import { useState, useEffect } from "react"
import { Search, Plus, Minus, Trash2, CreditCard, Banknote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CustomerSearchDialog } from "@/components/customer-search-dialog"
import { PaymentDialog } from "@/components/payment-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { getAllProductsAPI } from "../../../redux/features/productSlice"
import { createSaleAPI, createSaleItemAPI } from "../../../redux/features/salesSlice"
import { addInventoryLogAPI } from "@/../../redux/features/inventorySlice"

interface CartItem {
  product: ProductDto
  quantity: number
}

export default function POSPage() {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const { productsData, loading: productsLoading, error: productsError } = useSelector((state: RootState) => state.product)
  const { loading: salesLoading } = useSelector((state: RootState) => state.sales)
  const { loading: inventoryLoading } = useSelector((state: RootState) => state.inventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: number; name: string } | null>(null)

  useEffect(() => {
    dispatch(getAllProductsAPI())
  }, [dispatch])

  const categories = ["all", ...Array.from(new Set(productsData.map((p) => p.category)))]

  const filteredProducts = productsData
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm),
    )
    .filter((product) => categoryFilter === "all" || product.category === categoryFilter)

  const addToCart = (product: ProductDto) => {
    if (product.quantity <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is out of stock.`,
        variant: "destructive",
      })
      return
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)
      if (existingItem) {
        if (existingItem.quantity + 1 > product.quantity) {
          toast({
            title: "Stock Limit",
            description: `Cannot add more ${product.name}. Only ${product.quantity} in stock.`,
            variant: "destructive",
          })
          return prevCart
        }
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        return [...prevCart, { product, quantity: 1 }]
      }
    })
  }

  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    const product = productsData.find((p) => p.id === productId)
    if (!product) return

    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    if (newQuantity > product.quantity) {
      toast({
        title: "Stock Limit",
        description: `Cannot set quantity to ${newQuantity} for ${product.name}. Only ${product.quantity} in stock.`,
        variant: "destructive",
      })
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setSelectedCustomer(null)
  }

  const handleCustomerSelect = (customer: { id: number; name: string }) => {
    setSelectedCustomer(customer)
    setIsCustomerDialogOpen(false)
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.18 // 18% VAT for Sri Lanka
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handlePaymentComplete = async (paymentType: "CASH" | "CARD") => {
    if (!selectedCustomer) {
      toast({
        title: "No Customer Selected",
        description: "Please select a customer before completing the sale.",
        variant: "destructive",
      })
      return
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to the cart before completing the sale.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create Sale
      const sale: SaleDto = {
        saleTime: new Date().toISOString(),
        cashierId: 1, // Replace with actual cashier ID from auth state
        customerId: selectedCustomer.id,
        totalAmount: calculateTotal(),
        discount: 0, // Add discount logic if needed
        paidAmount: calculateTotal(),
        paymentType,
      }

      const saleResult = await dispatch(createSaleAPI(sale)).unwrap()

      if (saleResult.data?.id) {
        // Create Sale Items
        const saleItems: SaleItemDto[] = cart.map((item) => ({
          saleId: saleResult.data?.id ?? 0,
          productId: item.product.id!,
          quantity: item.quantity,
          pricePerUnit: item.product.sellingPrice,
          totalPrice: item.product.sellingPrice * item.quantity,
        }))

        for (const item of saleItems) {
          await dispatch(createSaleItemAPI(item)).unwrap()
        }

        // Update Inventory
        const inventoryLogs: InventoryLogDto[] = cart.map((item) => ({
          productId: item.product.id!,
          changeAmount: -item.quantity,
          reason: `Sale #${saleResult.data?.id ?? ""}`,
          updatedById: 1, // Replace with actual cashier ID
        }))

        for (const log of inventoryLogs) {
          await dispatch(addInventoryLogAPI(log)).unwrap()
        }

        toast({
          title: "Sale Completed",
          description: `Payment of LKR ${calculateTotal().toFixed(2)} received via ${paymentType}`,
        })

        clearCart()
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Sale Failed",
        description: error.message || "An error occurred while processing the sale.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Product Selection */}
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products or scan barcode..."
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

            {productsLoading ? (
              <div className="text-center">Loading products...</div>
            ) : productsError ? (
              <div className="text-center text-red-500">{productsError}</div>
            ) : (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-auto flex-col items-start justify-between p-4 text-left"
                    onClick={() => addToCart(product)}
                    disabled={product.quantity <= 0}
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-primary">LKR {product.sellingPrice.toFixed(2)}</div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cart */}
      <div className="w-full lg:w-[400px]">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Sale</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearCart} disabled={salesLoading || inventoryLoading}>
                Clear
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Customer:</span>
              <Button variant="outline" size="sm" onClick={() => setIsCustomerDialogOpen(true)}>
                {selectedCustomer ? selectedCustomer.name : "Select Customer"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No items in cart</p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateCartItemQuantity(item.product.id!, item.quantity - 1)}
                            disabled={salesLoading || inventoryLoading}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateCartItemQuantity(item.product.id!, item.quantity + 1)}
                            disabled={salesLoading || inventoryLoading}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        LKR {(item.product.sellingPrice * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.product.id!)}
                          disabled={salesLoading || inventoryLoading}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (18%)</span>
                <span>LKR {calculateTax().toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>LKR {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="grid w-full grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full"
                disabled={cart.length === 0 || salesLoading || inventoryLoading}
                onClick={() => handlePaymentComplete("CASH")}
              >
                <Banknote className="mr-2 h-4 w-4" />
                Cash
              </Button>
              <Button
                className="w-full"
                disabled={cart.length === 0 || salesLoading || inventoryLoading}
                onClick={() => handlePaymentComplete("CARD")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Card
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <CustomerSearchDialog
        open={isCustomerDialogOpen}
        onOpenChange={setIsCustomerDialogOpen}
        onSelect={handleCustomerSelect}
      />

      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        total={calculateTotal()} onComplete={function (paymentType: string): void {
          throw new Error("Function not implemented.")
        } }        //onComplete={handlePaymentComplete}
      />
    </div>
  )
}
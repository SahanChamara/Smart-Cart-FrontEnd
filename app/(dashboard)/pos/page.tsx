"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ProductDto } from "@/types/product"
import { useEffect, useState } from "react"
import { Search, Plus, Minus, Trash2, CreditCard, Banknote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CustomerSearchDialog } from "@/components/customer-search-dialog"
import { PaymentDialog } from "@/components/payment-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { RootState } from "@/redux/store"
import { getAllProductsAPI } from "@/redux/features/productSlice"

interface CartItem {
  product: ProductDto
  quantity: number
}

export default function POSPage() {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: number; name: string } | null>(null)
  const { productsData, loading, error } = useAppSelector((state: RootState) => state.product as {
    productsData: ProductDto[];
    loading: boolean;
    error: string | null;
  })

  useEffect(() => {
    dispatch(getAllProductsAPI());
  },[dispatch]);

  const [products] = useState<ProductDto[]>(productsData)

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm),
    )
    .filter((product) => categoryFilter === "all" || product.category === categoryFilter)

  const addToCart = (product: ProductDto) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        return [...prevCart, { product, quantity: 1 }]
      }
    })
  }

  const updateCartItemQuantity = (productId: number, newQuantity: number, stockQuantity: number) => {
    if(newQuantity > stockQuantity){
      console.log("stock quantity",stockQuantity);
      
       toast({
      title: "No Stock",
      description: `Enough Stoc in this Item`,
    })      
    }
    if (newQuantity <= 0) {
      removeFromCart(productId)
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

  const handlePaymentComplete = (paymentType: string) => {
    toast({
      title: "Sale completed",
      description: `Payment of $${calculateTotal().toFixed(2)} received via ${paymentType}`,
    })
    clearCart()
    router.push("/dashboard")
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.1 // 10% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
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

            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <Button
                  key={product.id}
                  variant="outline"
                  className="h-auto flex-col items-start justify-between p-4 text-left"
                  onClick={() => addToCart(product)}
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium text-primary">${product.sellingPrice.toFixed(2)}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart */}
      <div className="w-full lg:w-[400px]">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Sale</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearCart}>
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
                            onClick={() => updateCartItemQuantity(item.product.id!, item.quantity - 1, item.product.quantity)}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateCartItemQuantity(item.product.id!, item.quantity + 1, item.product.quantity)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ${(item.product.sellingPrice * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.product.id!)}
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
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="grid w-full grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full"
                disabled={cart.length === 0}
                onClick={() => setIsPaymentDialogOpen(true)}
              >
                <Banknote className="mr-2 h-4 w-4" />
                Cash
              </Button>
              <Button className="w-full" disabled={cart.length === 0} onClick={() => setIsPaymentDialogOpen(true)}>
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
        total={calculateTotal()}
        onComplete={handlePaymentComplete}
      />
    </div>
  )
}

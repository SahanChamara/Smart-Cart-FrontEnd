"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DiscountDto } from "@/types/discount"
import type { Product } from "@/types/discount"
import { useState } from "react"
import { Search, Plus, Edit, Trash2, Calendar, Percent } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DiscountDialog } from "@/components/discount-dialog"

export default function DiscountsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountDto | null>(null)

  // Mock data for demonstration
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Milk 1L",
      barcode: "8901234567890",
      category: "Dairy",
      quantity: 50,
      costPrice: 120,
      sellingPrice: 150,
      expiryDate: new Date(2023, 11, 31).toISOString(),
      supplier: { id: 1, name: "Dairy Farms Ltd", contactNumber: "0712345678", email: "contact@dairyfarms.com" },
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
      supplier: {
        id: 2,
        name: "Bakery Supplies Co",
        contactNumber: "0723456789",
        email: "info@bakerysupplies.com",
      },
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
      supplier: {
        id: 3,
        name: "Beverage Distributors",
        contactNumber: "0734567890",
        email: "orders@beveragedist.com",
      },
    },
  ])

  const [discounts, setDiscounts] = useState<DiscountDto[]>([
    {
      id: 1,
      name: "Summer Sale",
      percentage: 15,
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      applicableProducts: [products[0], products[1]],
    },
    {
      id: 2,
      name: "Beverage Discount",
      percentage: 10,
      startDate: "2023-11-15",
      endDate: "2023-12-15",
      applicableProducts: [products[2]],
    },
    {
      id: 3,
      name: "Holiday Special",
      percentage: 20,
      startDate: "2023-12-20",
      endDate: "2024-01-05",
      applicableProducts: [products[0], products[1], products[2]],
    },
  ])

  const filteredDiscounts = discounts.filter((discount) =>
    discount.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEdit = (discount: DiscountDto | null) => {
    setSelectedDiscount(discount)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setDiscounts(discounts.filter((d) => d.id !== id))
  }

  const handleSaveDiscount = (discount: DiscountDto) => {
    if (discount.id) {
      // Update existing discount
      setDiscounts(discounts.map((d) => (d.id === discount.id ? discount : d)))
    } else {
      // Add new discount
      const newDiscount = {
        ...discount,
        id: Math.max(...discounts.map((d) => d.id || 0)) + 1,
      }
      setDiscounts([...discounts, newDiscount])
    }
    setIsDialogOpen(false)
  }

  const isDiscountActive = (discount: DiscountDto) => {
    const today = new Date()
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)
    return today >= startDate && today <= endDate
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Discounts</h1>
        <Button onClick={() => handleAddEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Discount
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discount Management</CardTitle>
          <CardDescription>Create and manage product discounts and promotions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search discounts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Period</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead className="hidden md:table-cell">Products</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiscounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No discounts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDiscounts.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell className="font-medium">{discount.name}</TableCell>
                        <TableCell>
                          <Badge variant={isDiscountActive(discount) ? "default" : "secondary"}>
                            {isDiscountActive(discount) ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {format(new Date(discount.startDate), "MMM d, yyyy")} -{" "}
                              {format(new Date(discount.endDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Percent className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{discount.percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {discount.applicableProducts.map((product) => (
                              <Badge key={product.id} variant="outline" className="mr-1">
                                {product.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleAddEdit(discount)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(discount.id!)}>
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

      <DiscountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        discount={selectedDiscount}
        onSave={handleSaveDiscount}
        products={products}
      />
    </div>
  )
}

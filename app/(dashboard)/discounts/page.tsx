"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DiscountDto } from "@/types/discount"
import type { Product } from "@/types/discount"
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import { Search, Plus, Edit, Trash2, Calendar, Percent } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DiscountDialog } from "@/components/discount-dialog"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../redux/store"
import { getAllDiscountsAPI, getAllProductsForDiscountAPI, addDiscountAPI, updateDiscountAPI, deleteDiscountAPI } from "@/redux/features/discountSlice"

export default function DiscountsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { discountsData: discounts, productsData: products, loading, error } = useSelector((state: RootState) => state.discount)

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountDto | null>(null)

  useEffect(() => {
    dispatch(getAllDiscountsAPI())
    dispatch(getAllProductsForDiscountAPI())
  }, [dispatch])

  const filteredDiscounts = discounts.filter((discount: { name: string }) =>
    discount.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEdit = (discount: DiscountDto | null) => {
    setSelectedDiscount(discount)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    dispatch(deleteDiscountAPI(id))
  }

  const handleSaveDiscount = (discount: DiscountDto) => {
    if (discount.id) {
      dispatch(updateDiscountAPI(discount))
    } else {
      dispatch(addDiscountAPI(discount))
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
                  {loading.discounts ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : error.discounts ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-red-500">
                        {error.discounts}
                      </TableCell>
                    </TableRow>
                  ) : filteredDiscounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No discounts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDiscounts.map((discount: DiscountDto | null) =>
                      discount ? (
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
                                {discount.startDate ? format(new Date(discount.startDate), "MMM d, yyyy") : ""} -{" "}
                                {discount.endDate ? format(new Date(discount.endDate), "MMM d, yyyy") : ""}
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
                              {discount.applicableProducts.map((product: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
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
                      ) : null
                    )
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
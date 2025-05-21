"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProductDto } from "@/types/product"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductDto | null
  onSave: (product: ProductDto) => void
}

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState<ProductDto>({
    name: "",
    barcode: "",
    category: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    expiryDate: new Date().toISOString(),
    supplierId: 1,
  })

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: "",
        barcode: "",
        category: "",
        quantity: 0,
        costPrice: 0,
        sellingPrice: 0,
        expiryDate: new Date().toISOString(),
        supplierId: 1,
      })
    }
  }, [product, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "costPrice" || name === "sellingPrice" ? Number.parseFloat(value) : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {product ? "Update the product details below." : "Fill in the product details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barcode" className="text-right">
                Barcode
              </Label>
              <Input
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Grains">Grains</SelectItem>
                  <SelectItem value="Confectionery">Confectionery</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costPrice" className="text-right">
                Cost Price
              </Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.costPrice}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sellingPrice" className="text-right">
                Selling Price
              </Label>
              <Input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

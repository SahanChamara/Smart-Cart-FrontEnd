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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductDto } from "@/types/product"
import { useState, useEffect, useMemo } from "react"
import { SupplierDto } from "@/types/supplier"
import { id } from "date-fns/locale"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductDto | null
  onSave: (product: ProductDto) => void
  // suppliers: SupplierDto[] // Add suppliers prop
}

export function ProductDialog({ 
  open, 
  onOpenChange, 
  product, 
  onSave, 
  // suppliers 
}: ProductDialogProps) {
  const [formData, setFormData] = useState<ProductDto>({
    name: "",
    barcode: "",
    category: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    expiryDate: "",
    supplierId: 1,
  });

  const [suppliers, setSuppliers] = useState<SupplierDto[]>([
    {
      id:1,
      name:'kamal',
      contactNumber: "07759562515",
      email: "sahan@gmail.com"
    },
    {
      id:2,
      name:'amal',
      contactNumber: "04598512542",
      email: "sahan@gmail.com"
    },
    {
      id:3,
      name:'nimal',
      contactNumber: "0759845621",
      email: "sahan@gmail.com"
    },
  ])

  const [supplierOpen, setSupplierOpen] = useState(false)
  const [supplierSearch, setSupplierSearch] = useState("")

  // Filter suppliers based on search term
  const filteredSuppliers = useMemo(() => {
    if (!supplierSearch) return suppliers

    const searchTerm = supplierSearch.toLowerCase()
    return suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm) ||
      supplier.contactNumber?.toLowerCase().includes(searchTerm) ||
      supplier.email?.toLowerCase().includes(searchTerm)
    )
  }, [suppliers, supplierSearch])

  // Get selected supplier details
  const selectedSupplier = suppliers.find(supplier => supplier.id === formData.supplierId)

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
        expiryDate: "",
        supplierId: suppliers.length > 0 ? suppliers[0].id ?? 1 : 1,
      })
    }
  }, [product, open, suppliers])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "costPrice" || name === "sellingPrice" 
        ? Number.parseFloat(value) || 0 
        : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSupplierSelect = (supplierId: number) => {
    setFormData((prev) => ({ ...prev, supplierId }))
    setSupplierOpen(false)
    setSupplierSearch("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {product ? "Update the product details below." : "Fill in the product details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Supplier
              </Label>
              <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={supplierOpen}
                    className="col-span-3 justify-between"
                  >
                    {selectedSupplier
                      ? `${selectedSupplier.name} - ${selectedSupplier.contactNumber || 'No phone'}`
                      : "Select supplier..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="col-span-3 p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search suppliers by name, phone, or email..." 
                      value={supplierSearch}
                      onValueChange={setSupplierSearch}
                    />
                    <CommandEmpty>No suppliers found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {filteredSuppliers.map((supplier) => (
                          <CommandItem
                            key={supplier.id}
                            value={(supplier.id ?? "").toString()}
                            onSelect={() => supplier.id !== undefined && handleSupplierSelect(supplier.id)}
                            className="flex items-center justify-between"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{supplier.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {supplier.contactNumber && `📞 ${supplier.contactNumber}`}
                                {supplier.contactNumber && supplier.email && " • "}
                                {supplier.email && `✉️ ${supplier.email}`}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "ml-2 h-4 w-4",
                                formData.supplierId === supplier.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate" className="text-right">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? "Update Product" : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
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
import type { DiscountDto, Product } from "@/types/discount"
import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

interface DiscountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  discount: DiscountDto | null
  onSave: (discount: DiscountDto) => void
  products: Product[]
}

export function DiscountDialog({ open, onOpenChange, discount, onSave, products }: DiscountDialogProps) {
  const [formData, setFormData] = useState<DiscountDto>({
    name: "",
    percentage: 0,
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), "yyyy-MM-dd"),
    applicableProducts: [],
  })

  useEffect(() => {
    if (discount) {
      setFormData(discount)
    } else {
      setFormData({
        name: "",
        percentage: 0,
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), "yyyy-MM-dd"),
        applicableProducts: [],
      })
    }
  }, [discount, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "percentage" ? Number.parseFloat(value) : value,
    }))
  }

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        startDate: format(date, "yyyy-MM-dd"),
      }))
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        endDate: format(date, "yyyy-MM-dd"),
      }))
    }
  }

  const handleProductToggle = (product: Product, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        applicableProducts: [...prev.applicableProducts, product],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        applicableProducts: prev.applicableProducts.filter((p) => p.id !== product.id),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{discount ? "Edit Discount" : "Add New Discount"}</DialogTitle>
            <DialogDescription>
              {discount ? "Update the discount details below." : "Fill in the discount details below."}
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
              <Label htmlFor="percentage" className="text-right">
                Percentage (%)
              </Label>
              <Input
                id="percentage"
                name="percentage"
                type="number"
                min="0"
                max="100"
                value={formData.percentage}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(new Date(formData.startDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate ? new Date(formData.startDate) : undefined}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(new Date(formData.endDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate ? new Date(formData.endDate) : undefined}
                      onSelect={handleEndDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Applicable Products</Label>
              <div className="col-span-3 space-y-2 max-h-[200px] overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={formData.applicableProducts.some((p) => p.id === product.id)}
                      onCheckedChange={(checked) => handleProductToggle(product, checked as boolean)}
                    />
                    <Label htmlFor={`product-${product.id}`} className="font-normal">
                      {product.name}
                    </Label>
                  </div>
                ))}
              </div>
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

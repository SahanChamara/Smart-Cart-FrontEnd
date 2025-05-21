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
import { Textarea } from "@/components/ui/textarea"
import type { ProductDto } from "@/types/product"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InventoryAdjustmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductDto | null
  onSave: (productId: number, changeAmount: number, reason: string) => void
  products: ProductDto[]
}

export function InventoryAdjustmentDialog({
  open,
  onOpenChange,
  product,
  onSave,
  products,
}: InventoryAdjustmentDialogProps) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [changeAmount, setChangeAmount] = useState<number>(0)
  const [reason, setReason] = useState<string>("")

  useEffect(() => {
    if (product) {
      setSelectedProductId(product.id || null)
    } else {
      setSelectedProductId(null)
    }
    setChangeAmount(0)
    setReason("")
  }, [product, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProductId !== null) {
      onSave(selectedProductId, changeAmount, reason)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adjust Inventory</DialogTitle>
            <DialogDescription>Update inventory levels for a product.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!product && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product" className="text-right">
                  Product
                </Label>
                <Select
                  value={selectedProductId?.toString() || ""}
                  onValueChange={(value) => setSelectedProductId(Number(value))}
                >
                  <SelectTrigger id="product" className="col-span-3">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id?.toString() || ""}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(product || selectedProductId) && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentStock" className="text-right">
                    Current Stock
                  </Label>
                  <Input
                    id="currentStock"
                    value={product?.quantity || products.find((p) => p.id === selectedProductId)?.quantity || 0}
                    className="col-span-3"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="changeAmount" className="text-right">
                    Change Amount
                  </Label>
                  <Input
                    id="changeAmount"
                    type="number"
                    value={changeAmount}
                    onChange={(e) => setChangeAmount(Number(e.target.value))}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newStock" className="text-right">
                    New Stock
                  </Label>
                  <Input
                    id="newStock"
                    value={
                      (product?.quantity || products.find((p) => p.id === selectedProductId)?.quantity || 0) +
                      changeAmount
                    }
                    className="col-span-3"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">
                    Reason
                  </Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!selectedProductId}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Banknote } from "lucide-react"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  onComplete: (paymentType: string) => void
}

export function PaymentDialog({ open, onOpenChange, total, onComplete }: PaymentDialogProps) {
  const [paymentType, setPaymentType] = useState("CASH")
  const [amountPaid, setAmountPaid] = useState("")
  const [change, setChange] = useState(0)

  useEffect(() => {
    if (open) {
      setAmountPaid(total.toFixed(2))
      setChange(0)
    }
  }, [open, total])

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmountPaid(value)

    const paid = Number.parseFloat(value) || 0
    setChange(paid > total ? paid - total : 0)
  }

  const handleComplete = () => {
    onComplete(paymentType)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>Select payment method and enter payment details.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="cash" onValueChange={(value) => setPaymentType(value === "cash" ? "CASH" : "CARD")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cash">
              <Banknote className="mr-2 h-4 w-4" />
              Cash
            </TabsTrigger>
            <TabsTrigger value="card">
              <CreditCard className="mr-2 h-4 w-4" />
              Card
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cash" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right font-medium">Total:</div>
                <div className="col-span-3 font-bold">${total.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right font-medium">Amount Paid:</div>
                <Input
                  type="number"
                  min={total}
                  step="0.01"
                  value={amountPaid}
                  onChange={handleAmountPaidChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right font-medium">Change:</div>
                <div className="col-span-3 font-bold">${change.toFixed(2)}</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="card" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right font-medium">Total:</div>
                <div className="col-span-3 font-bold">${total.toFixed(2)}</div>
              </div>
              <div className="flex h-20 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">Process card payment on terminal</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button onClick={handleComplete}>Complete Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

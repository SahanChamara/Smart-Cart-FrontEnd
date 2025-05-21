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
import type { CustomerDto } from "@/types/customer"
import { useState, useEffect } from "react"

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: CustomerDto | null
  onSave: (customer: CustomerDto) => void
}

export function CustomerDialog({ open, onOpenChange, customer, onSave }: CustomerDialogProps) {
  const [formData, setFormData] = useState<CustomerDto>({
    name: "",
    phoneNumber: "",
    loyaltyPoints: 0,
  })

  useEffect(() => {
    if (customer) {
      setFormData(customer)
    } else {
      setFormData({
        name: "",
        phoneNumber: "",
        loyaltyPoints: 0,
      })
    }
  }, [customer, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "loyaltyPoints" ? Number.parseInt(value) : value,
    }))
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
            <DialogTitle>{customer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
            <DialogDescription>
              {customer ? "Update the customer details below." : "Fill in the customer details below."}
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
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="col-span-3"
                required
                pattern="^0\d{9}$"
                title="Phone number must be 10 digits starting with 0"
              />
            </div>
            {customer && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="loyaltyPoints" className="text-right">
                  Loyalty Points
                </Label>
                <Input
                  id="loyaltyPoints"
                  name="loyaltyPoints"
                  type="number"
                  min="0"
                  value={formData.loyaltyPoints}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

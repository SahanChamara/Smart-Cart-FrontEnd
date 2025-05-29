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
import type { SupplierDto } from "@/types/supplier"
import { useState, useEffect } from "react"

interface SupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: SupplierDto | null
  onSave: (supplier: SupplierDto) => void
}

export function SupplierDialog({ open, onOpenChange, supplier, onSave }: SupplierDialogProps) {
  const [formData, setFormData] = useState<SupplierDto>({
    name: "",
    contactNumber: "",
    email: "",
  })

  useEffect(() => {
    if (open) {
      setFormData(supplier || {
        name: "",
        contactNumber: "",
        email: "",
      })
    } /* else {
      setFormData({
        name: "",
        contactNumber: "",
        email: "",
      })
    } */
  }, [open,supplier])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
            <DialogTitle>{supplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
            <DialogDescription>
              {supplier ? "Update the supplier details below." : "Fill in the supplier details below."}
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
              <Label htmlFor="contactNumber" className="text-right">
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="col-span-3"
                required
                pattern="^0\d{9}$"
                title="Phone number must be 10 digits starting with 0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
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

"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CustomerSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (customer: { id: number; name: string }) => void
}

export function CustomerSearchDialog({ open, onOpenChange, onSelect }: CustomerSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for demonstration
  const customers = [
    { id: 1, name: "John Doe", phoneNumber: "0712345678" },
    { id: 2, name: "Jane Smith", phoneNumber: "0723456789" },
    { id: 3, name: "Robert Johnson", phoneNumber: "0734567890" },
    { id: 4, name: "Emily Davis", phoneNumber: "0745678901" },
    { id: 5, name: "Michael Wilson", phoneNumber: "0756789012" },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phoneNumber.includes(searchTerm),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>
          <DialogDescription>Search for a customer by name or phone number.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
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
                <TableHead>Phone Number</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => onSelect(customer)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Button variant="outline" onClick={() => onSelect({ id: 0, name: "Walk-in Customer" })}>
          Continue as Walk-in Customer
        </Button>
      </DialogContent>
    </Dialog>
  )
}

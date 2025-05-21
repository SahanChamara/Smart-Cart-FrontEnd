"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CustomerDto } from "@/types/customer"
import { useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { CustomerDialog } from "@/components/customer-dialog"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(null)

  // Mock data for demonstration
  const [customers, setCustomers] = useState<CustomerDto[]>([
    {
      id: 1,
      name: "John Doe",
      phoneNumber: "0712345678",
      loyaltyPoints: 150,
    },
    {
      id: 2,
      name: "Jane Smith",
      phoneNumber: "0723456789",
      loyaltyPoints: 75,
    },
    {
      id: 3,
      name: "Robert Johnson",
      phoneNumber: "0734567890",
      loyaltyPoints: 200,
    },
    {
      id: 4,
      name: "Emily Davis",
      phoneNumber: "0745678901",
      loyaltyPoints: 50,
    },
    {
      id: 5,
      name: "Michael Wilson",
      phoneNumber: "0756789012",
      loyaltyPoints: 125,
    },
  ])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phoneNumber.includes(searchTerm),
  )

  const handleAddEdit = (customer: CustomerDto | null) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  const handleSaveCustomer = (customer: CustomerDto) => {
    if (customer.id) {
      // Update existing customer
      setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)))
    } else {
      // Add new customer
      const newCustomer = {
        ...customer,
        id: Math.max(...customers.map((c) => c.id || 0)) + 1,
        loyaltyPoints: 0,
      }
      setCustomers([...customers, newCustomer])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button onClick={() => handleAddEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>Manage your customer database and loyalty program.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers by name or phone..."
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
                    <TableHead className="text-right">Loyalty Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.phoneNumber}</TableCell>
                        <TableCell className="text-right">{customer.loyaltyPoints}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleAddEdit(customer)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id!)}>
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

      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  )
}

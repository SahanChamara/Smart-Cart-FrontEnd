"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { SupplierDto } from "@/types/supplier"
import { useCallback, useEffect, useState } from "react"
import { Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react"
import { SupplierDialog } from "@/components/supplier-dialog"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { getAllSuppliersAPI } from "@/redux/features/supplierSlice"

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDto | null>(null)
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);

  const dispatch = useAppDispatch();
  const suppliersData: SupplierDto[] = useAppSelector((state) => state.supplier.suppliersData) || [];

  // Get All Suppliers
  useEffect(() => {
    dispatch(getAllSuppliersAPI());
  },[dispatch])

  useEffect(() => {
    setSuppliers(suppliersData)
  },[suppliersData])

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactNumber.includes(searchTerm),
  )

  const handleAddEdit = (supplier: SupplierDto | null) => {
    setSelectedSupplier(supplier)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setSuppliers(suppliers.filter((s) => s.id !== id))
  }

  const handleSaveSupplier = (supplier: SupplierDto) => {
    if (supplier.id) {      
      // Update existing supplier
      setSuppliers(suppliers.map((s) => (s.id === supplier.id ? supplier : s)))
    } else {
      // Add new supplier
      const newSupplier = {
        ...supplier,
        id: Math.max(...suppliers.map((s) => s.id || 0)) + 1,
      }
      setSuppliers([...suppliers, newSupplier])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
        <Button onClick={() => handleAddEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Management</CardTitle>
          <CardDescription>Manage your product suppliers and vendor relationships.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search suppliers..."
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
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No suppliers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{supplier.email}</TableCell>
                        <TableCell>{supplier.contactNumber}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={`mailto:${supplier.email}`}>
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Email</span>
                              </a>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <a href={`tel:${supplier.contactNumber}`}>
                                <Phone className="h-4 w-4" />
                                <span className="sr-only">Call</span>
                              </a>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleAddEdit(supplier)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id!)}>
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

      <SupplierDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        supplier={selectedSupplier}
        onSave={handleSaveSupplier}
      />
    </div>
  )
}

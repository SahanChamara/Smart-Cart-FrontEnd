"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SupplierDto } from "@/types/supplier";
import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { SupplierDialog } from "@/components/supplier-dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addSupplierAPI,
  getAllSuppliersAPI,
} from "@/redux/features/supplierSlice";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDto | null>(
    null
  );

  const dispatch = useAppDispatch();
  const { suppliersData, loading, error } = useAppSelector(
    (state) => state.supplier
  );

  // Get All Suppliers
  useEffect(() => {
    dispatch(getAllSuppliersAPI());
  }, [dispatch]);

  const filteredSuppliers = (suppliersData || []).filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactNumber.includes(searchTerm)
  );

  const handleAddEdit = (supplier: SupplierDto | null) => {
    setSelectedSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    // Delete implementation
  };

  const handleSaveSupplier = async (supplier: SupplierDto) => {
    try {
      if (supplier.id) {
        // Update existing supplier
      } else {
        const result = await dispatch(addSupplierAPI(supplier)).unwrap();
        if (result.status === 201 && result) {
          setSelectedSupplier(null);
          await dispatch(getAllSuppliersAPI());
          toast({
            title: "Success!",
            description: "Supplier has been added successfully.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Failed to save Supplier", error);
      toast({
        title: "Error",
        description: "Failed to save supplier. Please try again.",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => handleSaveSupplier(supplier)}
          >
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Suppliers
        </h1>
        <Button
          onClick={() => handleAddEdit(null)}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-lg sm:text-xl">
            Supplier Management
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Manage your product suppliers and vendor relationships.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="px-4 pt-2 sm:px-0">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search suppliers..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[150px]">Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Email
                    </TableHead>
                    <TableHead>Contact</TableHead>
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
                      <TableRow key={supplier.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium py-3">
                          {supplier.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-3">
                          <a href={`mailto:${supplier.email}`}>
                            {supplier.email}
                          </a>
                        </TableCell>
                        <TableCell className="py-3">
                          <a href={`tel:${supplier.contactNumber}`}>
                            {supplier.contactNumber}
                          </a>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9"
                              asChild
                            >
                              <a href={`mailto:${supplier.email}`}>
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="sr-only">Email</span>
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9"
                              asChild
                            >
                              <a href={`tel:${supplier.contactNumber}`}>
                                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="sr-only">Call</span>
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9"
                              onClick={() => handleAddEdit(supplier)}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9"
                              onClick={() => handleDelete(supplier.id!)}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
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
  );
}

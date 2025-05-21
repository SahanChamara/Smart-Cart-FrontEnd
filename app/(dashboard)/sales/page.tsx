"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { SaleDto } from "@/types/sale"
import { useState } from "react"
import { Search, Plus, Eye, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export default function SalesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // Mock data for demonstration
  const [sales] = useState<SaleDto[]>([
    {
      id: 1,
      saleTime: new Date(2023, 10, 15, 14, 30).toISOString(),
      cashierId: 1,
      customerId: 1,
      totalAmount: 450,
      discount: 0,
      paidAmount: 450,
      paymentType: "CASH",
    },
    {
      id: 2,
      saleTime: new Date(2023, 10, 15, 16, 45).toISOString(),
      cashierId: 2,
      customerId: 2,
      totalAmount: 780,
      discount: 50,
      paidAmount: 730,
      paymentType: "CARD",
    },
    {
      id: 3,
      saleTime: new Date(2023, 10, 16, 10, 15).toISOString(),
      cashierId: 1,
      customerId: 3,
      totalAmount: 320,
      discount: 0,
      paidAmount: 320,
      paymentType: "CASH",
    },
    {
      id: 4,
      saleTime: new Date(2023, 10, 16, 13, 20).toISOString(),
      cashierId: 3,
      customerId: 4,
      totalAmount: 1250,
      discount: 100,
      paidAmount: 1150,
      paymentType: "CARD",
    },
    {
      id: 5,
      saleTime: new Date(2023, 10, 17, 9, 30).toISOString(),
      cashierId: 2,
      customerId: 5,
      totalAmount: 550,
      discount: 0,
      paidAmount: 550,
      paymentType: "CASH",
    },
  ])

  const filteredSales = sales
    .filter((sale) => sale.id?.toString().includes(searchTerm))
    .filter((sale) => paymentFilter === "all" || sale.paymentType === paymentFilter)
    .filter((sale) => {
      if (!dateRange?.from) return true
      const saleDate = new Date(sale.saleTime)
      if (dateRange.to) {
        return saleDate >= dateRange.from && saleDate <= dateRange.to
      }
      return saleDate.toDateString() === dateRange.from.toDateString()
    })

  const handleNewSale = () => {
    router.push("/pos")
  }

  const handleViewSale = (id: number) => {
    router.push(`/sales/${id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <Button onClick={handleNewSale}>
          <Plus className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>View and manage all sales transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by sale ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange
                className="w-full sm:w-[300px]"
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead className="hidden md:table-cell">Customer ID</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No sales found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">#{sale.id}</TableCell>
                        <TableCell>{format(new Date(sale.saleTime), "PPp")}</TableCell>
                        <TableCell className="hidden md:table-cell">{sale.customerId}</TableCell>
                        <TableCell>
                          <Badge variant={sale.paymentType === "CASH" ? "outline" : "secondary"}>
                            {sale.paymentType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${sale.totalAmount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewSale(sale.id!)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Printer className="h-4 w-4" />
                              <span className="sr-only">Print</span>
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
    </div>
  )
}

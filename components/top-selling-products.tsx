"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function TopSellingProducts() {
  // Mock data for demonstration
  const topProducts = [
    { id: 1, name: "Milk 1L", category: "Dairy", sold: 350, revenue: 52500 },
    { id: 2, name: "Bread", category: "Bakery", sold: 320, revenue: 32000 },
    { id: 3, name: "Coca Cola 1.5L", category: "Beverages", sold: 280, revenue: 33600 },
    { id: 4, name: "Rice 5kg", category: "Grains", sold: 150, revenue: 82500 },
    { id: 5, name: "Chocolate Bar", category: "Confectionery", sold: 200, revenue: 16000 },
  ]

  const chartData = topProducts.map((product) => ({
    name: product.name,
    sold: product.sold,
  }))

  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value}`, "Units Sold"]} />
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Bar dataKey="sold" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Units Sold</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">{product.sold}</TableCell>
                <TableCell className="text-right">${(product.revenue / 100).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

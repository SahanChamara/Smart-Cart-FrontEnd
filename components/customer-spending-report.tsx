"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function CustomerSpendingReport() {
  // Mock data for demonstration
  const topCustomers = [
    { id: 1, name: "John Doe", visits: 15, spent: 125000, loyaltyPoints: 150 },
    { id: 2, name: "Jane Smith", visits: 8, spent: 87500, loyaltyPoints: 75 },
    { id: 3, name: "Robert Johnson", visits: 12, spent: 95000, loyaltyPoints: 200 },
    { id: 4, name: "Emily Davis", visits: 5, spent: 45000, loyaltyPoints: 50 },
    { id: 5, name: "Michael Wilson", visits: 10, spent: 75000, loyaltyPoints: 125 },
  ]

  const chartData = topCustomers.map((customer) => ({
    name: customer.name,
    spent: customer.spent / 100,
  }))

  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip formatter={(value) => [`$${value}`, "Total Spent"]} />
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Bar dataKey="spent" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Visits</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="text-right">Loyalty Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="text-right">{customer.visits}</TableCell>
                <TableCell className="text-right">${(customer.spent / 100).toFixed(2)}</TableCell>
                <TableCell className="text-right">{customer.loyaltyPoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

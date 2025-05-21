"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts"

interface InventoryReportChartProps {
  chartType: string
}

export function InventoryReportChart({ chartType }: InventoryReportChartProps) {
  // Mock data for demonstration
  const inventoryData = [
    { category: "Dairy", stock: 120 },
    { category: "Bakery", stock: 85 },
    { category: "Beverages", stock: 200 },
    { category: "Grains", stock: 150 },
    { category: "Confectionery", stock: 75 },
    { category: "Produce", stock: 95 },
    { category: "Meat", stock: 60 },
    { category: "Frozen", stock: 110 },
  ]

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "bar" ? (
          <BarChart data={inventoryData}>
            <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value}`, "Units in Stock"]} />
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Bar dataKey="stock" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
          </BarChart>
        ) : (
          <LineChart data={inventoryData}>
            <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value}`, "Units in Stock"]} />
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Line type="monotone" dataKey="stock" stroke="currentColor" strokeWidth={2} className="stroke-primary" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

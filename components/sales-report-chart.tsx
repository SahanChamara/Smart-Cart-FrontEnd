"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts"
import type { DateRange } from "react-day-picker"

interface SalesReportChartProps {
  chartType: string
  dateRange?: DateRange
}

export function SalesReportChart({ chartType, dateRange }: SalesReportChartProps) {
  // Mock data for demonstration
  const salesData = [
    { name: "Jan", total: 1500 },
    { name: "Feb", total: 2300 },
    { name: "Mar", total: 1800 },
    { name: "Apr", total: 2400 },
    { name: "May", total: 2800 },
    { name: "Jun", total: 3200 },
    { name: "Jul", total: 2900 },
    { name: "Aug", total: 3500 },
    { name: "Sep", total: 3800 },
    { name: "Oct", total: 4200 },
    { name: "Nov", total: 4800 },
    { name: "Dec", total: 5200 },
  ]

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "bar" ? (
          <BarChart data={salesData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
          </BarChart>
        ) : (
          <LineChart data={salesData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Line type="monotone" dataKey="total" stroke="currentColor" strokeWidth={2} className="stroke-primary" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

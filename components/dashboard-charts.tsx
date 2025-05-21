"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts"

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

const inventoryData = [
  { name: "Jan", stock: 120 },
  { name: "Feb", stock: 150 },
  { name: "Mar", stock: 180 },
  { name: "Apr", stock: 220 },
  { name: "May", stock: 250 },
  { name: "Jun", stock: 280 },
  { name: "Jul", stock: 300 },
  { name: "Aug", stock: 320 },
  { name: "Sep", stock: 340 },
  { name: "Oct", stock: 360 },
  { name: "Nov", stock: 380 },
  { name: "Dec", stock: 400 },
]

export function DashboardCharts() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
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
                  <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="inventory" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => [`${value}`, "Stock Level"]} />
                  <Line
                    type="monotone"
                    dataKey="stock"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="stroke-primary"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

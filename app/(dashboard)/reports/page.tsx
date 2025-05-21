"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { useState } from "react"
import { SalesReportChart } from "@/components/sales-report-chart"
import { InventoryReportChart } from "@/components/inventory-report-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Printer, BarChart3, PieChart, LineChart } from "lucide-react"
import { TopSellingProducts } from "@/components/top-selling-products"
import { CustomerSpendingReport } from "@/components/customer-spending-report"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })
  const [salesChartType, setSalesChartType] = useState("bar")
  const [inventoryChartType, setInventoryChartType] = useState("bar")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <DatePickerWithRange className="w-full sm:w-[300px]" dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="products">Product Reports</TabsTrigger>
          <TabsTrigger value="customers">Customer Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>View your sales performance over time.</CardDescription>
              </div>
              <Select value={salesChartType} onValueChange={setSalesChartType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Bar Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center">
                      <LineChart className="mr-2 h-4 w-4" />
                      Line Chart
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <SalesReportChart chartType={salesChartType} dateRange={dateRange} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Payment Method</CardTitle>
                <CardDescription>Distribution of sales by payment type.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-[300px]">
                  <PieChart className="h-full w-full text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Sales Distribution</CardTitle>
                <CardDescription>Sales patterns throughout the day.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart3 className="h-full w-full text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inventory Levels</CardTitle>
                <CardDescription>Monitor your inventory levels by category.</CardDescription>
              </div>
              <Select value={inventoryChartType} onValueChange={setInventoryChartType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Bar Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center">
                      <LineChart className="mr-2 h-4 w-4" />
                      Line Chart
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <InventoryReportChart chartType={inventoryChartType} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Items</CardTitle>
                <CardDescription>Products that need to be restocked soon.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart3 className="h-full w-full text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
                <CardDescription>How quickly products are sold and replaced.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart className="h-full w-full text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Your best performing products by sales volume.</CardDescription>
            </CardHeader>
            <CardContent>
              <TopSellingProducts />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Profitability</CardTitle>
                <CardDescription>Margin analysis by product category.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart3 className="h-full w-full text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Sales Trends</CardTitle>
                <CardDescription>Sales patterns over time by product.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart className="h-full w-full text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Spending</CardTitle>
              <CardDescription>Top customers by total purchase amount.</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerSpendingReport />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>Repeat purchase patterns and customer loyalty.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart className="h-full w-full text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program Impact</CardTitle>
                <CardDescription>Effect of loyalty points on customer spending.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart3 className="h-full w-full text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

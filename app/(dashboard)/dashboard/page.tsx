import { DashboardCards } from "@/components/dashboard-cards"
import { DashboardCharts } from "@/components/dashboard-charts"
import { RecentSales } from "@/components/recent-sales"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardCards />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <DashboardCharts />
            <RecentSales />
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2 flex h-[400px] items-center justify-center rounded-lg border border-dashed p-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-xl font-bold">Analytics Content</h3>
                <p className="text-sm text-muted-foreground">Detailed analytics will be displayed here</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2 flex h-[400px] items-center justify-center rounded-lg border border-dashed p-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-xl font-bold">Reports Content</h3>
                <p className="text-sm text-muted-foreground">Generated reports will be displayed here</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

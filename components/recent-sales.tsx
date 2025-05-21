import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentSales() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            </div>
            <div className="ml-auto font-medium">+$450.00</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Jane Smith</p>
              <p className="text-sm text-muted-foreground">jane.smith@example.com</p>
            </div>
            <div className="ml-auto font-medium">+$780.00</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>RJ</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Robert Johnson</p>
              <p className="text-sm text-muted-foreground">robert.johnson@example.com</p>
            </div>
            <div className="ml-auto font-medium">+$320.00</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>ED</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Emily Davis</p>
              <p className="text-sm text-muted-foreground">emily.davis@example.com</p>
            </div>
            <div className="ml-auto font-medium">+$1,250.00</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

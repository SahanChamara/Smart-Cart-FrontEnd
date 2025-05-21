"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Store,
  Truck,
  Tag,
  FileText,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "POS",
    href: "/pos",
    icon: ShoppingCart,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: BarChart3,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Store,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Truck,
  },
  {
    title: "Discounts",
    href: "/discounts",
    icon: Tag,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-2 py-6">
          <h1 className="mb-4 text-lg font-bold">POS System</h1>
          <div className="grid gap-2 py-2">
            {navItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    pathname === item.href ? "bg-accent" : "transparent",
                  )}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

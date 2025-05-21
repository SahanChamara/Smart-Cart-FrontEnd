import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Search } from "@/components/search"
import { Suspense } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <MobileNav />
        <div className="hidden md:block">
          <h1 className="text-xl font-bold">POS System</h1>
        </div>
        <div className="flex-1 md:grow-0">
          <Suspense>
            <Search />
          </Suspense>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <DashboardNav />
        </aside>
        <main className="flex flex-col p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

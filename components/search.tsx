"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

export function Search() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // In a real app, this would navigate to search results
      console.log(`Searching for: ${searchTerm}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full md:w-auto">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full pl-8 md:w-[200px] lg:w-[300px]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePathname } from "next/navigation"

interface NavigationProps {
  onSearch: (query: string) => void
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export function Navigation({ onSearch, onToggleSidebar, isSidebarOpen }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname() // Get current route

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }
  const showSearch = pathname === "/"

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="md:hidden">
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl font-bold text-primary">VelopTools</h1>
        </div>

        {showSearch && (

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>
)}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            About
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            Contact
          </Button>
        </div>
      </div>
    </nav>
  )
}

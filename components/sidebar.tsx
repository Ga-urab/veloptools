"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Wrench, FileText, Palette, QrCode, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onCategorySelect: (category: string) => void
  selectedCategory: string
}

const categories = [
  {
    id: "all",
    name: "All Tools",
    icon: Wrench,
    tools: [],
  },
  {
    id: "converters",
    name: "Converters",
    icon: Settings,
    tools: ["JSON to CSV", "CSV to JSON", "Base64 Encoder/Decoder", "URL Encoder/Decoder"],
  },
  {
    id: "text-tools",
    name: "Text Tools",
    icon: FileText,
    tools: ["Word Counter", "Text Formatter", "Case Converter", "Lorem Ipsum Generator"],
  },
  {
    id: "color-tools",
    name: "Color Tools",
    icon: Palette,
    tools: ["Color Picker", "Gradient Generator", "Color Palette", "Hex to RGB"],
  },
  {
    id: "generators",
    name: "Generators",
    icon: QrCode,
    tools: ["QR Code Generator", "Password Generator", "UUID Generator", "Hash Generator"],
  },
]

export function Sidebar({ isOpen, onCategorySelect, selectedCategory }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["all"])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-40",
        "md:relative md:top-0 md:h-[calc(100vh-4rem)] md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-64",
      )}
    >
      <div className="p-4 space-y-2">
        {categories.map((category) => {
          const Icon = category.icon
          const isExpanded = expandedCategories.includes(category.id)
          const isSelected = selectedCategory === category.id

          return (
            <div key={category.id} className="space-y-1">
              <Button
                variant={isSelected ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isSelected && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
                onClick={() => {
                  onCategorySelect(category.id)
                  if (category.tools.length > 0) {
                    toggleCategory(category.id)
                  }
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{category.name}</span>
                {category.tools.length > 0 &&
                  (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
              </Button>

              {category.tools.length > 0 && isExpanded && (
                <div className="ml-6 space-y-1">
                  {category.tools.map((tool) => (
                    <Button
                      key={tool}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                    >
                      {tool}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

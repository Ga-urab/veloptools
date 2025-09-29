"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Sidebar } from "@/components/sidebar"
import { ToolCard } from "@/components/tool-card"
import { Footer } from "@/components/footer"
import {
  QrCode,
  FileJson,
  Palette,
  Hash,
  Type,
  Eye,
  Shuffle,
  Calculator,
  ImageIcon,
  Link,
  FileText,
  Zap,
} from "lucide-react"

const tools = [
    {
    id: "cuche",
    title: "Chuche Game Recorder",
    description:
      "Play and record your cuche game rounds easily. Track scores, save progress, and determine the winner.",
    icon: QrCode,
    category: "card-games",
    href: "/tools/cuche",
  },
   {
    id: "marriage",
    title: "Marriage Game Recorder",
    description:
      "Play and record your marriage game rounds easily. Track scores, save progress, and determine the winner.",
    icon: QrCode,
    category: "card-games",
    href: "/tools/marriage",
    
  },
   {
    id: "callBreak",
    title: "Call Break Game Recorder",
    description:
      "Play and record your call break game rounds easily. Track scores, save progress, and determine the winner.",
    icon: QrCode,
    category: "card-games",
    href: "/tools/callbreak",
  },
  {
    id: "qr-generator",
    title: "QR Code Generator",
    description:
      "Generate QR codes for URLs, text, or any data. Customize size, colors, and download in various formats.",
    icon: QrCode,
    category: "generators",
    href: "/tools/qr-generator",
  },
  {
    id: "json-csv",
    title: "JSON to CSV Converter",
    description:
      "Convert JSON data to CSV format quickly and easily. Perfect for data analysis and spreadsheet imports.",
    icon: FileJson,
    category: "converters",
    href: "/tools/json-csv",
  },
  {
    id: "color-picker",
    title: "Color Picker",
    description: "Pick colors from images, generate palettes, and convert between color formats (HEX, RGB, HSL).",
    icon: Palette,
    category: "color-tools",
    href: "/tools/color-picker",
  },
  {
    id: "hash-generator",
    title: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256 hashes for text or files. Useful for data integrity verification.",
    icon: Hash,
    category: "generators",
    href: "/tools/hash-generator",
  },
  {
    id: "text-formatter",
    title: "Text Formatter",
    description: "Format, clean, and transform text. Remove extra spaces, convert case, and more.",
    icon: Type,
    category: "text-tools",
    href: "/tools/text-formatter",
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate secure passwords with customizable length, characters, and complexity requirements.",
    icon: Eye,
    category: "generators",
    href: "/tools/password-generator",
  },
  {
    id: "uuid-generator",
    title: "UUID Generator",
    description: "Generate unique identifiers (UUIDs) in various formats for your applications and databases.",
    icon: Shuffle,
    category: "generators",
    href: "/tools/uuid-generator",
  },
  {
    id: "base64-encoder",
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings. Perfect for data transmission and storage.",
    icon: Calculator,
    category: "converters",
    href: "/tools/base64",
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize images while maintaining aspect ratio. Support for multiple formats and batch processing.",
    icon: ImageIcon,
    category: "converters",
    href: "/tools/image-resizer",
  },
  {
    id: "url-shortener",
    title: "URL Shortener",
    description: "Create short, memorable URLs for sharing. Track clicks and manage your links.",
    icon: Link,
    category: "generators",
    href: "/tools/url-shortener",
  },
  {
    id: "word-counter",
    title: "Word Counter",
    description: "Count words, characters, paragraphs, and reading time. Perfect for writers and content creators.",
    icon: FileText,
    category: "text-tools",
    href: "/tools/text-formatter",
  },
  {
    id: "gradient-generator",
    title: "Gradient Generator",
    description: "Create beautiful CSS gradients with live preview. Copy code for your web projects.",
    icon: Zap,
    category: "color-tools",
    href: "/tools/color-picker",
  },
  {
    id: "date-calculator",
    title: "Date Calculator",
    description: "Create beautiful CSS gradients with live preview. Copy code for your web projects.",
    icon: Zap,
    category: "calculator",
    href: "/tools/date-calculator",
  },
  {
    id: "timezone-converter",
    title: "Timezone Converter",
    description: "Create beautiful CSS gradients with live preview. Copy code for your web projects.",
    icon: Zap,
    category: "converters",
    href: "/tools/timezone-converter",
  },
]

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTools = useMemo(() => {
    let filtered = tools

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((tool) => tool.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tool) => tool.title.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [selectedCategory, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setIsSidebarOpen(false) // Close sidebar on mobile after selection
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navigation onSearch={handleSearch} onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} /> */}

      <div className="flex flex-1">
        {/* <Sidebar isOpen={isSidebarOpen} onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} /> */}

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        <main className="flex-1 p-6 md:ml-0">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-balance mb-2">
                {selectedCategory === "all"
                  ? "All Tools"
                  : selectedCategory
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
              </h2>
              <p className="text-muted-foreground text-pretty">
                {searchQuery
                  ? `Found ${filteredTools.length} tools matching "${searchQuery}"`
                  : "Discover powerful web tools to boost your productivity"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  category={tool.category.replace("-", " ")}
                  href={tool.href}
                />
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No tools found matching your criteria.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or selecting a different category.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

    </div>
  )
}

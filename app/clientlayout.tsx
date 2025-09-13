// app/ClientLayout.tsx
"use client"

import { useState, Suspense, type ReactNode } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import "./globals.css"

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <div className="min-h-screen flex flex-col">
            {/* Global Navigation */}
            <Navigation onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

            <div className="flex flex-1">
              {/* Global Sidebar */}
              <Sidebar
                isOpen={isSidebarOpen}
                onCategorySelect={() => setIsSidebarOpen(false)}
                selectedCategory="all"
              />

              {/* Mobile overlay */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-30 md:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              {/* Page content */}
              <main className="flex-1 p-6">{children}</main>
            </div>

            {/* Global Footer */}
            <Footer />
          </div>

          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}

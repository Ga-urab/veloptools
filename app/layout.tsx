// app/layout.tsx
import type { ReactNode } from "react"
import ClientLayout from "./clientlayout"

export const metadata = {
  title: "WelopTools - Essential Web Tools",
  description:
    "A collection of useful web tools including QR converter, JSON to CSV, color picker and more",
  icons: { icon: "/favicon.png" },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}

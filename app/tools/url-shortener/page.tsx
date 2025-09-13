"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"

export default function URLShortenerPage() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [map, setMap] = useState<Record<string, string>>({}) // local mapping

  const generateShortUrl = (longUrl: string) => {
    try {
      const urlObj = new URL(longUrl)
      const hash = btoa(urlObj.href).replace(/=/g, "").slice(0, 6)
      // store in local map
      setMap((prev) => ({ ...prev, [hash]: urlObj.href }))
      return `${window.location.origin}/s/${hash}`
    } catch {
      return ""
    }
  }

  const handleShorten = () => {
    if (!url) return
    const result = generateShortUrl(url)
    if (!result) {
      setError("Please enter a valid URL (include http/https)")
      setShortUrl("")
    } else {
      setShortUrl(result)
      setError("")
      setCopied(false)
    }
  }

  const handleCopy = () => {
    if (!shortUrl) return
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
  }

  const handleOpen = () => {
    const hash = shortUrl.split("/s/")[1]
    if (hash && map[hash]) {
      window.open(map[hash], "_blank")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">URL Shortener</h1>
      <p className="text-muted-foreground">
        Shorten your long URLs quickly. Copy and open them directly in your browser.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="url"
          placeholder="Enter URL including https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleShorten} className="w-full sm:w-auto">
          Shorten
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {shortUrl && (
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-100 rounded p-3">
          <a
            href="#"
            onClick={handleOpen}
            className="break-all text-blue-600 hover:underline"
          >
            {shortUrl}
          </a>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>
          Note: This is a client-side shortener. URLs only work in this browser session.
        </p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy } from "lucide-react"

export default function TextFormatterPage() {
  const [text, setText] = useState("")
  const [copied, setCopied] = useState(false)

  const handleUppercase = () => setText(text.toUpperCase())
  const handleLowercase = () => setText(text.toLowerCase())
  const handleTrim = () => setText(text.replace(/\s+/g, " ").trim())
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const charCount = text.length
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length
  const paragraphCount = text.split(/\n+/).filter(Boolean).length
  const readingTime = Math.ceil(wordCount / 200) // in minutes

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Text Formatter & Word Counter</h1>
      <p className="text-muted-foreground">
        Quickly format text, count words, characters, sentences, paragraphs, and estimate reading time.
      </p>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="w-full h-40 p-3 border rounded"
      />

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleUppercase}>UPPERCASE</Button>
        <Button onClick={handleLowercase}>lowercase</Button>
        <Button onClick={handleTrim}>Trim Spaces</Button>
        <Button variant="outline" onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-1" />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <div className="text-muted-foreground space-y-1 mt-2">
        <p>Words: {wordCount}</p>
        <p>Characters: {charCount}</p>
        <p>Sentences: {sentenceCount}</p>
        <p>Paragraphs: {paragraphCount}</p>
        <p>Estimated Reading Time: {readingTime} min</p>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>All operations happen locally in your browser. No data is sent to any server.</p>
      </div>
    </div>
  )
}

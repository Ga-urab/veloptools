"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download } from "lucide-react"
import { FileUploader } from "@/components/ui/file-uploader"

export default function JsonToCsvPage() {
  const [jsonText, setJsonText] = useState("")
  const [csvText, setCsvText] = useState("")
  const [copied, setCopied] = useState(false)

  // --- Handle JSON file upload ---
  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setJsonText(e.target?.result as string)
    reader.readAsText(file)
  }

  // --- Flatten nested objects ---
  const flattenObject = (obj: any, parentKey = "", result: any = {}) => {
    for (const key in obj) {
      const value = obj[key]
      const newKey = parentKey ? `${parentKey}.${key}` : key

      if (value && typeof value === "object" && !Array.isArray(value)) {
        flattenObject(value, newKey, result)
      } else if (Array.isArray(value)) {
        result[newKey] = value.join(", ") // Join arrays as comma string
      } else {
        result[newKey] = value
      }
    }
    return result
  }

  // --- Convert JSON to CSV ---
  const convertToCsv = () => {
    try {
      const parsed = JSON.parse(jsonText)

      let rows: any[] = []

      // Top-level array
      if (Array.isArray(parsed)) {
        rows = parsed.map((item) => flattenObject(item))
      }
      // Top-level object with arrays
      else if (typeof parsed === "object" && parsed !== null) {
        rows = Object.entries(parsed).flatMap(([category, arr]) => {
          if (!Array.isArray(arr)) return []
          return arr.map((item) => flattenObject({ category, ...item }))
        })
      } else {
        alert("Unsupported JSON format")
        return
      }

      if (rows.length === 0) {
        alert("No data found to convert")
        return
      }

      // Collect all headers
      const headers = Array.from(
        rows.reduce((acc, obj) => {
          Object.keys(obj).forEach((key) => acc.add(key))
          return acc
        }, new Set<string>())
      )

      const csvRows = [
        headers.join(","), // header row
        ...rows.map((row) =>
          headers
            .map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`)
            .join(",")
        ),
      ]

      setCsvText(csvRows.join("\n"))
      setCopied(false)
    } catch (err) {
      alert("Invalid JSON")
      console.error(err)
    }
  }

  // --- Copy CSV ---
  const copyCsv = () => {
    navigator.clipboard.writeText(csvText)
    setCopied(true)
  }

  // --- Download CSV ---
  const downloadCsv = () => {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "data.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <h1 className="text-3xl font-bold">JSON to CSV Converter</h1>
      <p className="text-muted-foreground">
        Paste JSON or upload a JSON file. Converts almost any JSON to CSV, including nested objects and arrays.
      </p>

      {/* --- File Uploader --- */}
      <FileUploader accept="application/json" onFileSelect={handleFile} />

      {/* --- JSON Input --- */}
      <Textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder='Paste JSON here'
        className="w-full h-40 p-3 border rounded"
      />

      <Button onClick={convertToCsv}>Convert to CSV</Button>

      {/* --- CSV Output --- */}
      {csvText && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">CSV Output:</p>
          <Textarea value={csvText} readOnly className="w-full h-40 p-3 border rounded" />
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={copyCsv}>
              <Copy className="w-4 h-4 mr-1" /> {copied ? "Copied!" : "Copy CSV"}
            </Button>
            <Button variant="outline" onClick={downloadCsv}>
              <Download className="w-4 h-4 mr-1" /> Download CSV
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>All conversions happen locally in your browser. No data is sent to any server.</p>
      </div>
    </div>
  )
}

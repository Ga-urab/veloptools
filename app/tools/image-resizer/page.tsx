"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { FileUploader } from "@/components/ui/file-uploader"

export default function ImageToolsPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [resizedPreview, setResizedPreview] = useState<string>("")
  const [base64, setBase64] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [width, setWidth] = useState<number>(300)
  const [height, setHeight] = useState<number>(300)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // --- Resize Image ---
  const handleResize = () => {
    if (!imageFile) return
    const img = new Image()
    img.src = imagePreview
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL(imageFile.type)
        setResizedPreview(dataUrl)
      }
    }
  }

  // --- Convert to Base64 ---
  const handleToBase64 = () => {
    if (!imageFile) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setBase64(ev.target?.result as string)
    }
    reader.readAsDataURL(imageFile)
  }

  // --- Copy Base64 ---
  const handleCopyBase64 = () => {
    if (!base64) return
    navigator.clipboard.writeText(base64)
    setCopied(true)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Image Tools</h1>
      <p className="text-muted-foreground">
        Resize images, convert to Base64, and copy/download results. Fully frontend and client-side.
      </p>

      {/* --- File Uploader --- */}
      <FileUploader
        accept="image/*"
        maxSizeMB={10}
        onFileSelect={(file) => {
          setImageFile(file)
          const reader = new FileReader()
          reader.onload = (ev) => setImagePreview(ev.target?.result as string)
          reader.readAsDataURL(file)
          setResizedPreview("")
          setBase64("")
          setCopied(false)
        }}
      />

      {/* --- Original Preview --- */}
      {imagePreview && (
        <div>
          <p className="text-sm text-muted-foreground mt-2">Original Preview:</p>
          <img src={imagePreview} alt="Original" className="max-h-60 mt-1 border rounded" />
        </div>
      )}

      {/* --- Resize --- */}
      {imagePreview && (
        <div className="space-y-2 mt-4">
          <p className="font-medium">Resize Image</p>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              placeholder="Width"
              className="w-24 border rounded px-2 py-1"
            />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              placeholder="Height"
              className="w-24 border rounded px-2 py-1"
            />
            <Button onClick={handleResize}>Resize</Button>
          </div>
          {resizedPreview && (
            <div>
              <p className="text-sm text-muted-foreground">Resized Preview:</p>
              <img src={resizedPreview} alt="Resized" className="max-h-60 mt-1 border rounded" />
              <a
                href={resizedPreview}
                download="resized-image.png"
                className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:underline"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          )}
        </div>
      )}

      {/* --- Base64 Encoder --- */}
      {imagePreview && (
        <div className="space-y-2 mt-4">
          <p className="font-medium">Base64 Encoder</p>
          <div className="flex gap-2 flex-col">
            <Button onClick={handleToBase64}>Convert to Base64</Button>
            {base64 && (
              <div className="flex flex-col sm:flex-row gap-2">
                <input readOnly value={base64} className="flex-1 break-all border rounded px-2 py-1" />
                <Button variant="outline" onClick={handleCopyBase64}>
                  <Copy className="w-4 h-4 mr-1" /> {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <div className="mt-4 text-sm text-gray-500">
        <p>All operations happen locally in your browser. No data is sent to any server.</p>
      </div>
    </div>
  )
}

"use client"

import { useRef, useState, useCallback } from "react"
import { Button } from "./button"
import { UploadCloud } from "lucide-react"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSizeMB?: number
}

export function FileUploader({ onFileSelect, accept = "*/*", maxSizeMB = 10 }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")

  const handleFiles = useCallback((files: FileList) => {
    const file = files[0]
    if (!file) return
    if (file.size / 1024 / 1024 > maxSizeMB) {
      setError(`File exceeds ${maxSizeMB}MB limit`)
      return
    }
    setError("")
    onFileSelect(file)
  }, [onFileSelect, maxSizeMB])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <UploadCloud className="w-10 h-10 mx-auto text-gray-400" />
        <p className="mt-2 text-gray-600">
          Drag & drop your file here, or <span className="text-blue-500 underline">click to select</span>
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        accept={accept}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

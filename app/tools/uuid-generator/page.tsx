"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"

function generateUUID() {
  // UUID v4 generator
  return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  )
}

export default function UUIDGeneratorPage() {
  const [count, setCount] = useState(1)
  const [uuids, setUuids] = useState<string[]>([])
  const [copiedUuid, setCopiedUuid] = useState("")

  const generateUuids = () => {
    const arr = Array.from({ length: count }, () => generateUUID())
    setUuids(arr)
    setCopiedUuid("")
  }

  const copyUuid = (uuid: string) => {
    navigator.clipboard.writeText(uuid)
    setCopiedUuid(uuid)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"))
    setCopiedUuid("all")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <h1 className="text-3xl font-bold">UUID Generator</h1>
      <p className="text-muted-foreground">
        Generate random UUIDs (v4) instantly. All operations happen locally in your browser.
      </p>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-24"
        />
        <Button onClick={generateUuids}>Generate UUIDs</Button>
        {uuids.length > 0 && (
          <Button variant="outline" onClick={copyAll}>
            <Copy className="w-4 h-4 mr-1" />
            {copiedUuid === "all" ? "Copied!" : "Copy All"}
          </Button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2 mt-4">
          {uuids.map((uuid, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                readOnly
                value={uuid}
                className="flex-1 border rounded p-2 font-mono text-sm"
              />
              <Button variant="outline" size="sm" onClick={() => copyUuid(uuid)}>
                <Copy className="w-4 h-4 mr-1" />
                {copiedUuid === uuid ? "Copied!" : "Copy"}
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>All UUIDs are generated locally in your browser. No data is sent to any server.</p>
      </div>
    </div>
  )
}

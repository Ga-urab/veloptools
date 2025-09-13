"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy } from "lucide-react"
import SparkMD5 from "spark-md5"

export default function HashGeneratorPage() {
  const [text, setText] = useState("")
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [copiedHash, setCopiedHash] = useState("")

  // --- Compute all hashes ---
  const generateHashes = async () => {
    const enc = new TextEncoder()
    const data = enc.encode(text)

    // MD5 using spark-md5
    const md5 = SparkMD5.hash(text)

    // SHA hashes using crypto.subtle
    const sha1Buffer = await crypto.subtle.digest("SHA-1", data)
    const sha256Buffer = await crypto.subtle.digest("SHA-256", data)
    const sha512Buffer = await crypto.subtle.digest("SHA-512", data)

    const bufferToHex = (buffer: ArrayBuffer) =>
      Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

    setHashes({
      MD5: md5,
      "SHA-1": bufferToHex(sha1Buffer),
      "SHA-256": bufferToHex(sha256Buffer),
      "SHA-512": bufferToHex(sha512Buffer),
    })
    setCopiedHash("")
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <h1 className="text-3xl font-bold">Hash Generator</h1>
      <p className="text-muted-foreground">
        Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for any text. All operations happen locally in your browser.
      </p>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to hash..."
        className="w-full h-32 p-3 border rounded"
      />

      <Button onClick={generateHashes} disabled={!text}>
        Generate Hashes
      </Button>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3 mt-4">
          {Object.entries(hashes).map(([type, hash]) => (
            <div key={type} className="flex items-center gap-2">
              <span className="w-24 font-medium">{type}:</span>
              <input
                className="flex-1 border rounded p-2 text-sm font-mono"
                readOnly
                value={hash}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyHash(hash)}
              >
                <Copy className="w-4 h-4 mr-1" />
                {copiedHash === hash ? "Copied!" : "Copy"}
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>All hashing is done locally in your browser. No data is sent to any server.</p>
      </div>
    </div>
  )
}

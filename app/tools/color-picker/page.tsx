"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"

function hexToRgb(hex: string) {
  const sanitized = hex.replace("#", "")
  const bigint = parseInt(sanitized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

function lightenDarkenColor(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  const newR = Math.min(255, Math.max(0, r + amount))
  const newG = Math.min(255, Math.max(0, g + amount))
  const newB = Math.min(255, Math.max(0, b + amount))
  return rgbToHex(newR, newG, newB)
}

export default function ColorToolsPage() {
  const [activeTab, setActiveTab] = useState<"picker" | "gradient" | "converter" | "adjust">("picker")

  // ----- Color Picker -----
  const [color, setColor] = useState("#ff0000")
  const [copied, setCopied] = useState(false)

  // ----- Gradient Generator -----
  const [grad1, setGrad1] = useState("#ff0000")
  const [grad2, setGrad2] = useState("#0000ff")
  const [angle, setAngle] = useState(90)
  const [gradientCss, setGradientCss] = useState(`linear-gradient(90deg, #ff0000, #0000ff)`)

  // ----- HEX <-> RGB Converter -----
  const [hexInput, setHexInput] = useState("#00ff00")
  const [rgbInput, setRgbInput] = useState({ r: 0, g: 255, b: 0 })

  // ----- Lighten/Darken Tool -----
  const [adjustAmount, setAdjustAmount] = useState(20)
  const [adjustedColor, setAdjustedColor] = useState(color)

  // ----- Handlers -----
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
  }

  const updateGradient = (c1: string, c2: string, a: number) => {
    const css = `linear-gradient(${a}deg, ${c1}, ${c2})`
    setGradientCss(css)
  }

  const handleHexToRgb = () => {
    const { r, g, b } = hexToRgb(hexInput)
    setRgbInput({ r, g, b })
  }

  const handleRgbToHex = () => {
    const hex = rgbToHex(rgbInput.r, rgbInput.g, rgbInput.b)
    setHexInput(hex)
  }

  const handleAdjustColor = () => {
    const newColor = lightenDarkenColor(color, adjustAmount)
    setAdjustedColor(newColor)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Color Tools</h1>
      <p className="text-muted-foreground">
        Pick colors, generate gradients, convert formats, and lighten/darken colors.
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {["picker", "gradient", "converter", "adjust"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* --- Color Picker Tab --- */}
      {activeTab === "picker" && (
        <div className="space-y-4">
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-20 h-10 p-0"
          />
          <div className="flex gap-3">
            <Input readOnly value={`HEX: ${color}`} />
            <Input
              readOnly
              value={`RGB: ${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b}`}
            />
            <Button variant="outline" size="sm" onClick={() => handleCopy(color)}>
              <Copy className="w-4 h-4 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div
            className="h-20 w-full rounded-md border"
            style={{ background: color }}
          />
        </div>
      )}

      {/* --- Gradient Generator Tab --- */}
      {activeTab === "gradient" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label>Color 1</label>
              <Input
                type="color"
                value={grad1}
                onChange={(e) => {
                  setGrad1(e.target.value)
                  updateGradient(e.target.value, grad2, angle)
                }}
                className="w-20 h-10 p-0"
              />
            </div>
            <div>
              <label>Color 2</label>
              <Input
                type="color"
                value={grad2}
                onChange={(e) => {
                  setGrad2(e.target.value)
                  updateGradient(grad1, e.target.value, angle)
                }}
                className="w-20 h-10 p-0"
              />
            </div>
            <div>
              <label>Angle</label>
              <Input
                type="number"
                value={angle}
                onChange={(e) => {
                  const a = Number(e.target.value)
                  setAngle(a)
                  updateGradient(grad1, grad2, a)
                }}
                className="w-20"
              />
            </div>
          </div>
          <div
            className="h-40 rounded-md border"
            style={{ background: gradientCss }}
          />
          <div className="flex gap-3">
            <Input readOnly value={gradientCss} />
            <Button variant="outline" size="sm" onClick={() => handleCopy(gradientCss)}>
              <Copy className="w-4 h-4 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      )}

      {/* --- HEX ↔ RGB Converter Tab --- */}
      {activeTab === "converter" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="#RRGGBB"
            />
            <Button onClick={handleHexToRgb}>HEX → RGB</Button>
          </div>
          <div className="flex gap-3 items-center">
            <Input
              type="number"
              value={rgbInput.r}
              onChange={(e) => setRgbInput({ ...rgbInput, r: Number(e.target.value) })}
              placeholder="R"
              className="w-20"
            />
            <Input
              type="number"
              value={rgbInput.g}
              onChange={(e) => setRgbInput({ ...rgbInput, g: Number(e.target.value) })}
              placeholder="G"
              className="w-20"
            />
            <Input
              type="number"
              value={rgbInput.b}
              onChange={(e) => setRgbInput({ ...rgbInput, b: Number(e.target.value) })}
              placeholder="B"
              className="w-20"
            />
            <Button onClick={handleRgbToHex}>RGB → HEX</Button>
          </div>
          <div className="flex gap-3">
            <Input readOnly value={`HEX: ${hexInput}`} />
            <Input readOnly value={`RGB: ${rgbInput.r}, ${rgbInput.g}, ${rgbInput.b}`} />
          </div>
        </div>
      )}

      {/* --- Lighten/Darken Tool Tab --- */}
      {activeTab === "adjust" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-20 h-10 p-0"
            />
            <Input
              type="number"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(Number(e.target.value))}
              className="w-24"
            />
            <Button onClick={handleAdjustColor}>Apply</Button>
          </div>
          <div
            className="h-20 w-full rounded-md border"
            style={{ background: adjustedColor }}
          />
          <div className="flex gap-3">
            <Input readOnly value={adjustedColor} />
            <Button variant="outline" size="sm" onClick={() => handleCopy(adjustedColor)}>
              <Copy className="w-4 h-4 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>All operations happen locally in your browser. No data is sent to any server.</p>
      </div>
    </div>
  )
}

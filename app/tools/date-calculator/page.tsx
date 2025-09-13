"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"

export default function DateCalculatorPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [addDays, setAddDays] = useState(0)
  const [result, setResult] = useState("")

  const calculateDifference = () => {
    if (!startDate || !endDate) return
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = Math.abs((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    setResult(`${diff} day(s)`)
  }

  const calculateAddDays = () => {
    if (!startDate) return
    const start = new Date(startDate)
    start.setDate(start.getDate() + Number(addDays))
    setResult(start.toDateString())
  }

  const copyResult = () => {
    navigator.clipboard.writeText(result)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <h1 className="text-3xl font-bold">Date Calculator</h1>
      <p className="text-muted-foreground">
        Calculate days between dates or add/subtract days to a date.
      </p>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <Button onClick={calculateDifference}>Days Between</Button>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input
            type="number"
            value={addDays}
            onChange={(e) => setAddDays(Number(e.target.value))}
            placeholder="Days to add/subtract"
          />
          <Button onClick={calculateAddDays}>Add Days</Button>
        </div>

        {result && (
          <div className="flex items-center gap-2">
            <span className="font-mono">{result}</span>
            <Button variant="outline" size="sm" onClick={copyResult}>
              <Copy className="w-4 h-4 mr-1" /> Copy
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

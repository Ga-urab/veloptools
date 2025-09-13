"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"
import { DateTime } from "luxon"
import timeZones from "../../data/timezones.json"

export default function TimeZoneConverterPage() {
  const [dateTime, setDateTime] = useState("")
  const [fromZone, setFromZone] = useState("UTC")
  const [toZone, setToZone] = useState("UTC")
  const [converted, setConverted] = useState("")

  const convertTime = () => {
    if (!dateTime) return

    try {
      const dt = DateTime.fromISO(dateTime, { zone: fromZone })
      const convertedDT = dt.setZone(toZone)
      setConverted(convertedDT.toFormat("yyyy-LL-dd HH:mm"))
    } catch {
      setConverted("Invalid date or time zone")
    }
  }

  const copyResult = () => {
    if (converted) navigator.clipboard.writeText(converted)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <h1 className="text-3xl font-bold">Time Zone Converter</h1>
      <p className="text-muted-foreground">
        Convert time between different time zones accurately. All operations happen locally.
      </p>

      <div className="space-y-4">
        <Input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />

        <div className="flex flex-col md:flex-row gap-2">
          <select
            value={fromZone}
            onChange={(e) => setFromZone(e.target.value)}
            className="border rounded p-2 flex-1"
          >
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>

          <select
            value={toZone}
            onChange={(e) => setToZone(e.target.value)}
            className="border rounded p-2 flex-1"
          >
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>

          <Button onClick={convertTime}>Convert</Button>
        </div>

        {converted && (
          <div className="flex items-center gap-2">
            <span className="font-mono">{converted}</span>
            <Button variant="outline" size="sm" onClick={copyResult}>
              <Copy className="w-4 h-4 mr-1" /> Copy
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

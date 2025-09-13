"use client";

import { useState, useEffect } from "react";

export default function Base64Converter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (err) {
      setOutput("Invalid input for decoding");
    }
  }, [input, mode]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-xl font-semibold">VelopTools — Base64 Converter</h1>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="encode"
                  checked={mode === "encode"}
                  onChange={() => setMode("encode")}
                />
                Encode
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="decode"
                  checked={mode === "decode"}
                  onChange={() => setMode("decode")}
                />
                Decode
              </label>
            </div>

            <div>
              <label className="text-sm font-medium">Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={mode === "encode" ? "Type text to encode..." : "Paste Base64 to decode..."}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Output</label>
              <textarea
                value={output}
                readOnly
                rows={5}
                className="mt-1 w-full rounded border-gray-300 bg-gray-100"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Copy Output
              </button>
              <button
                onClick={() => { setInput(""); setOutput(""); }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <aside className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm text-center">
            {mode === "encode"
              ? "Base64 encoding converts your text into a safe ASCII format."
              : "Decoding will revert Base64 back to the original text."}
          </p>
        </aside>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function QRGeneratorPage() {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null); 
  const [text, setText] = useState("https://veloptools.com");
  const [size, setSize] = useState(400);
  const [margin, setMargin] = useState(2);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [format, setFormat] = useState<"png" | "svg">("png");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoScale, setLogoScale] = useState(0.2);
  const [loading, setLoading] = useState(false);
  const [lastSvg, setLastSvg] = useState("");
  const [debouncedText, setDebouncedText] = useState(text);

  // debounce input (500ms)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedText(text), 500);
    return () => clearTimeout(handler);
  }, [text]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText, size, margin, fgColor, bgColor, format, errorLevel, logoFile, logoScale]);

  async function generate() {
    setLoading(true);
    try {
      const preview = previewRef.current;
      const hidden = hiddenCanvasRef.current;
      if (!preview || !hidden) return;

      // clamp size between 100–1000px
      const safeSize = Math.min(Math.max(size, 100), 1000);

      if (format === "svg") {
        const svg = await QRCode.toString(debouncedText || " ", {
          type: "svg",
          errorCorrectionLevel: errorLevel,
          margin,
          color: { dark: fgColor, light: bgColor },
        });
        setLastSvg(svg);

        // Preview SVG → 400x400
        const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const ctx = preview.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, preview.width, preview.height);
          ctx.drawImage(img, 0, 0, preview.width, preview.height);
          URL.revokeObjectURL(url);
          setLoading(false);
        };
        img.src = url;
      } else {
        // PNG generation (hidden high-res canvas)
        await QRCode.toCanvas(hidden, debouncedText || " ", {
          errorCorrectionLevel: errorLevel,
          margin,
          width: safeSize,
          color: { dark: fgColor, light: bgColor },
        });

        if (logoFile) {
          await drawLogo(hidden, logoFile, logoScale);
        }

        // Scale down to 400x400 preview
        const ctx = preview.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, preview.width, preview.height);
          ctx.drawImage(hidden, 0, 0, preview.width, preview.height);
        }

        setLoading(false);
      }
    } catch (err) {
      console.error("QR generation failed:", err);
      setLoading(false);
    }
  }

  async function drawLogo(canvas: HTMLCanvasElement, file: File, scale: number) {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject();

          const qrW = canvas.width;
          const maxSize = qrW * Math.min(Math.max(scale, 0.05), 0.5);

          let w = img.width;
          let h = img.height;
          const aspect = w / h;
          if (w > h) {
            w = maxSize;
            h = Math.round(w / aspect);
          } else {
            h = maxSize;
            w = Math.round(h * aspect);
          }
          const x = (qrW - w) / 2;
          const y = (qrW - h) / 2;

          // white background behind logo
          ctx.fillStyle = bgColor;
          ctx.fillRect(x - 6, y - 6, w + 12, h + 12);

          ctx.drawImage(img, x, y, w, h);
          resolve();
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function download() {
    if (format === "svg") {
      const blob = new Blob([lastSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, "qr-code.svg");
    } else {
      const url = hiddenCanvasRef.current?.toDataURL("image/png");
      if (url) triggerDownload(url, "qr-code.png");
    }
  }

  function triggerDownload(url: string, filename: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-xl font-semibold">VelopTools — QR Generator</h1>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <div>
              <label className="text-sm font-medium">Text / URL</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Size (px)</label>
                <input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="mt-1 w-full rounded border-gray-300"
                  min={100}
                  max={1000}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Margin</label>
                <input
                  type="number"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="mt-1 w-full rounded border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Foreground</label>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="mt-1 w-full h-10 rounded border"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Background</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="mt-1 w-full h-10 rounded border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Error correction</label>
                <select
                  value={errorLevel}
                  onChange={(e) => setErrorLevel(e.target.value as any)}
                  className="mt-1 w-full rounded border-gray-300"
                >
                  <option value="L">L</option>
                  <option value="M">M</option>
                  <option value="Q">Q</option>
                  <option value="H">H</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="mt-1 w-full rounded border-gray-300"
                >
                  <option value="png">PNG</option>
                  <option value="svg">SVG</option>
                </select>
              </div>
            </div>

            {/* Logo upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Logo (optional)</label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-gray-500 hover:border-indigo-400 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  {logoFile ? (
                    <span className="text-sm">{logoFile.name}</span>
                  ) : (
                    <span className="text-sm">Click to upload or drag a logo here</span>
                  )}
                </label>
              </div>
            </div>

            {/* Logo scale (only active if logo uploaded) */}
            <div className={`${logoFile ? "opacity-100" : "opacity-50"} transition`}>
              <label className="text-sm font-medium">Logo scale</label>
              <input
                type="range"
                min={0.05}
                max={0.5}
                step={0.01}
                value={logoScale}
                onChange={(e) => setLogoScale(Number(e.target.value))}
                className="w-full mt-2"
                disabled={!logoFile}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={generate}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {loading ? "Generating..." : "Regenerate"}
              </button>
              <button
                onClick={download}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <aside className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center">
          <canvas ref={previewRef} width={400} height={400} className="border" />
          <canvas ref={hiddenCanvasRef} width={size} height={size} className="hidden" />
          <p className="mt-4 text-xs text-gray-500">
            Preview fixed at 400×400 — Download at{" "}
            {Math.min(Math.max(size, 100), 1000)}px
          </p>
        </aside>
      </main>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { resizeImage, formatBytes } from "@/lib/image-utils";

type Preset = { label: string; w: number; h: number };

const PRESETS: Preset[] = [
  { label: "16×16", w: 16, h: 16 },
  { label: "32×32", w: 32, h: 32 },
  { label: "64×64", w: 64, h: 64 },
  { label: "128×128", w: 128, h: 128 },
  { label: "256×256", w: 256, h: 256 },
  { label: "512×512", w: 512, h: 512 },
  { label: "1024×1024", w: 1024, h: 1024 },
  { label: "1920×1080", w: 1920, h: 1080 },
  { label: "1080×1920", w: 1080, h: 1920 },
  { label: "800×600", w: 800, h: 600 },
];

const FORMATS = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
];

export default function ResizeImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [resized, setResized] = useState<{ url: string; name: string }[]>([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(92);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback((fl: FileList | null) => {
    if (!fl || fl.length === 0) return;
    const arr = Array.from(fl).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) { setError("Please select image files."); return; }
    setError("");
    setResized([]);
    const newPreviews = arr.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...arr]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Set default dimensions from first image's original size
    const img = new Image();
    img.onload = () => {
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = URL.createObjectURL(arr[0]);
  }, []);

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => { URL.revokeObjectURL(prev[idx]); return prev.filter((_, i) => i !== idx); });
    setResized([]);
  }, []);

  const applyPreset = useCallback((preset: Preset) => { setWidth(preset.w); setHeight(preset.h); }, []);

  const handleResize = useCallback(async () => {
    if (files.length === 0) return;
    if (!width || !height) { setError("Please set width and height."); return; }
    setProcessing(true); setError("");
    try {
      const results: { url: string; name: string }[] = [];
      for (const file of files) {
        const { url } = await resizeImage(file, width, height, format, quality / 100);
        const ext = format.split("/")[1];
        const base = file.name.replace(/\.[^.]+$/, "");
        results.push({ url, name: `${base}_${width}x${height}.${ext === "jpeg" ? "jpg" : ext}` });
      }
      setResized(results);
    } catch { setError("Failed to resize one or more images."); } finally { setProcessing(false); }
  }, [files, width, height, format, quality]);

  const download = useCallback((url: string, filename: string) => {
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  }, []);

  const downloadAll = useCallback(() => { resized.forEach((r) => download(r.url, r.name)); }, [resized, download]);

  const inputClass = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const btnClass = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const labelClass = "text-sm font-medium mb-1 block";

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Resize Image</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Resize images to custom dimensions. All processing is done in your browser — no data uploaded.</p>

      <div className="mb-4 p-6 rounded-lg border-2 border-dashed text-center" style={{ borderColor: "var(--border)" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}>
        <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>Drop images here</p>
        <input type="file" accept="image/*" multiple
          className="block mx-auto text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer"
          style={{ color: "var(--fg)" }}
          onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {error && <p className="text-sm mb-3" style={{ color: "var(--danger)" }}>{error}</p>}

      {previews.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-4">
          {previews.map((pv, i) => (
            <div key={i} className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
              <img src={pv} alt="" className="w-full h-36 object-contain" />
              <div className="p-2 text-xs flex justify-between" style={{ color: "var(--muted)" }}>
                <span className="truncate max-w-[120px]">{files[i].name}</span>
                <span>{formatBytes(files[i].size)}</span>
                <button onClick={() => removeFile(i)} className="hover:underline" style={{ color: "var(--danger)" }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="p-4 rounded-lg border space-y-3 mb-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <p className="font-medium text-sm">{files.length} file{files.length > 1 ? "s" : ""} selected</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className={labelClass}>Width (px)</label><input type="number" className={inputClass} value={width || ""} min={1} max={10000} onChange={(e) => { const v = Number(e.target.value); setWidth(v); if (lockRatio && height && v) setHeight(Math.round(v * height / width)); }} style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }} placeholder="Auto" /></div>
            <div><label className={labelClass}>Height (px)</label><input type="number" className={inputClass} value={height || ""} min={1} max={10000} onChange={(e) => { const v = Number(e.target.value); setHeight(v); if (lockRatio && width && v) setWidth(Math.round(v * width / height)); }} style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }} placeholder="Auto" /></div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} className="rounded" />
            Lock aspect ratio
          </label>
          <div>
            <label className={labelClass}>Presets</label>
            <div className="flex flex-wrap gap-1">
              {PRESETS.map((p) => (<button key={p.label} onClick={() => applyPreset(p)} className="px-2 py-1 text-xs rounded border" style={{ borderColor: "var(--border)" }}>{p.label}</button>))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className={labelClass}>Format</label>
              <select className={inputClass} value={format} onChange={(e) => setFormat(e.target.value)} style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                {FORMATS.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
              </select>
            </div>
            <div><label className={labelClass}>Quality: {quality}%</label>
              <input type="range" className="w-full" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
            </div>
          </div>
          <button onClick={handleResize} disabled={processing} className={`${btnClass} disabled:opacity-40`} style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            {processing ? "Processing..." : "Resize Images"}
          </button>
        </div>
      )}

      {resized.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Results</h2>
            {resized.length > 1 && <button onClick={downloadAll} className="text-sm hover:underline" style={{ color: "var(--accent)" }}>Download All</button>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {resized.map((r, i) => (
              <div key={i} className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
                <img src={r.url} alt="" className="w-full h-36 object-contain" />
                <div className="p-2">
                  <button onClick={() => download(r.url, r.name)} className={`${btnClass} w-full`} style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

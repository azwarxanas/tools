"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { compressImage, formatBytes } from "@/lib/image-utils";

const FORMATS = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/avif", label: "AVIF" },
];

export default function CompressImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [results, setResults] = useState<{ url: string; name: string; originalSize: number; newSize: number }[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState("image/jpeg");
  const [maxWidth, setMaxWidth] = useState(1920);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback((fl: FileList | null) => {
    if (!fl || fl.length === 0) return;
    const arr = Array.from(fl).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) { setError("Please select image files."); return; }
    setError("");
    setResults([]);
    const newPreviews = arr.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...arr]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => { URL.revokeObjectURL(prev[idx]); return prev.filter((_, i) => i !== idx); });
    setResults([]);
  }, []);

  const handleCompress = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true); setError("");
    try {
      const res = [];
      for (const file of files) {
        const r = await compressImage(file, quality / 100, format, maxWidth || undefined);
        const ext = format.split("/")[1];
        const base = file.name.replace(/\.[^.]+$/, "");
        res.push({ ...r, name: `${base}_compressed.${ext === "jpeg" ? "jpg" : ext}` });
      }
      setResults(res);
    } catch { setError("Failed to compress one or more images."); } finally { setProcessing(false); }
  }, [files, quality, format, maxWidth]);

  const download = useCallback((url: string, filename: string) => {
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  }, []);

  const downloadAll = useCallback(() => { results.forEach((r) => download(r.url, r.name)); }, [results, download]);

  const totalOriginal = results.reduce((s, r) => s + r.originalSize, 0);
  const totalNew = results.reduce((s, r) => s + r.newSize, 0);
  const savings = totalOriginal > 0 ? Math.round((1 - totalNew / totalOriginal) * 100) : 0;

  const inputClass = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const btnClass = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const labelClass = "text-sm font-medium mb-1 block";

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Compress Image</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Reduce image file size while keeping good quality. All processing is done in your browser — no data uploaded.</p>

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
          <div>
            <label className={labelClass}>Quality: {quality}%</label>
            <input type="range" className="w-full" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
            <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}><span>Smaller file</span><span>Best quality</span></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className={labelClass}>Output Format</label>
              <select className={inputClass} value={format} onChange={(e) => setFormat(e.target.value)} style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                {FORMATS.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
              </select>
            </div>
            <div><label className={labelClass}>Max Width (px, 0 = original)</label>
              <input type="number" className={inputClass} value={maxWidth} min={0} max={10000} onChange={(e) => setMaxWidth(Number(e.target.value))} style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }} />
            </div>
          </div>
          <button onClick={handleCompress} disabled={processing} className={`${btnClass} disabled:opacity-40`} style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            {processing ? "Processing..." : "Compress Images"}
          </button>
        </div>
      )}

      {results.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Results</h2>
            <div className="flex items-center gap-3">
              {results.length > 1 && <button onClick={downloadAll} className="text-sm hover:underline" style={{ color: "var(--accent)" }}>Download All</button>}
              {savings > 0 && <span className="text-sm font-medium" style={{ color: "var(--success)" }}>Saved {savings}%</span>}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r, i) => (
              <div key={i} className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
                <img src={r.url} alt="" className="w-full h-36 object-contain" />
                <div className="p-2 space-y-1">
                  <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
                    <span>{formatBytes(r.originalSize)} → {formatBytes(r.newSize)}</span>
                    <span style={{ color: "var(--success)" }}>-{Math.round((1 - r.newSize / r.originalSize) * 100)}%</span>
                  </div>
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

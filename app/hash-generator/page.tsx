"use client";

import { useState } from "react";
import Link from "next/link";
import CryptoJS from "crypto-js";

const ALGOS = [
  { label: "SHA-1", key: "SHA1" },
  { label: "SHA-256", key: "SHA256" },
  { label: "SHA-384", key: "SHA384" },
  { label: "SHA-512", key: "SHA512" },
] as const;

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState("SHA256");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const algoFn: Record<string, (msg: string) => CryptoJS.lib.WordArray> = {
    SHA1: CryptoJS.SHA1,
    SHA256: CryptoJS.SHA256,
    SHA384: CryptoJS.SHA384,
    SHA512: CryptoJS.SHA512,
  };

  const generate = () => {
    if (!input) { setResult(""); return; }
    const hash = algoFn[algo](input).toString(CryptoJS.enc.Hex);
    setResult(hash);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const inputClass = "w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const btnClass = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const labelClass = "text-sm font-medium mb-1 block";

  const currentAlgo = ALGOS.find((a) => a.key === algo);

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Hash Generator</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes.</p>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Input Text</label>
          <textarea className={inputClass} rows={5} value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", resize: "vertical" }} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className={labelClass} style={{ margin: 0 }}>Algorithm:</label>
          <select className="rounded-lg border px-3 py-2 text-sm" value={algo} onChange={(e) => setAlgo(e.target.value)} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            {ALGOS.map((a) => (<option key={a.key} value={a.key}>{a.label}</option>))}
          </select>
          <button onClick={generate} disabled={!input} className={`${btnClass} disabled:opacity-40`} style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Generate</button>
        </div>

        {result && (
          <div>
            <label className={labelClass}>Hash ({currentAlgo?.label})</label>
            <div className="flex gap-2">
              <input type="text" readOnly value={result} className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm outline-none" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--fg)" }} />
              <button onClick={handleCopy} className={`${btnClass}`} style={{ backgroundColor: copied ? "var(--success)" : "var(--accent)", color: "#fff" }}>{copied ? "Copied!" : "Copy"}</button>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{currentAlgo?.label} · {result.length / 2} bytes · {result.length} hex chars</p>
          </div>
        )}
      </div>
    </div>
  );
}

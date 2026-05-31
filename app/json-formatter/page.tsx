"use client";

import { useState } from "react";
import Link from "next/link";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const format = () => {
    if (!input.trim()) { setError(""); setOutput(""); return; }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message);
    }
  };

  const validate = () => {
    if (!input.trim()) { setError(""); return; }
    try {
      JSON.parse(input);
      setError("");
      setOutput(output || input);
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message);
    }
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setError("Failed to copy."); }
  };

  const inputClass = "w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const btnClass = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const labelClass = "text-sm font-medium mb-1 block";

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">JSON Formatter</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Format, validate, and minify JSON data.</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>Input</label>
          <textarea className={inputClass} rows={12} value={input} onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", resize: "vertical" }} />
        </div>
        <div>
          <label className={labelClass}>Output</label>
          <div className="p-3 rounded-lg border font-mono text-sm whitespace-pre-wrap break-words overflow-auto" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--fg)", minHeight: "12rem", maxHeight: "24rem" }}>
            {output || error || "Result will appear here..."}
          </div>
        </div>
      </div>

      {error && <p className="text-sm mt-2" style={{ color: "var(--danger)" }}>{error}</p>}

      <div className="flex flex-wrap gap-2 mt-4 items-center">
        <button onClick={format} className={btnClass} style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Format</button>
        <button onClick={minify} className={btnClass} style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Minify</button>
        <button onClick={validate} className={btnClass} style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Validate</button>
        <button onClick={handleCopy} disabled={!output} className={`${btnClass} disabled:opacity-40`} style={{ backgroundColor: copied ? "var(--success)" : "var(--accent)", color: "#fff" }}>{copied ? "Copied!" : "Copy"}</button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm" style={{ color: "var(--muted)" }}>Indent:</label>
          <select className="rounded-lg border px-2 py-1 text-sm" value={indent} onChange={(e) => setIndent(Number(e.target.value))} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={0}>0 (compact)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

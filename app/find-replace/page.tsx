"use client";

import { useState } from "react";
import Link from "next/link";

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function FindReplacePage() {
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [replaceAll, setReplaceAll] = useState(true);
  const [result, setResult] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleReplace = () => {
    if (!input || !find) return setError("Please enter text to find and replace.");
    setError("");
    try {
      const flags = (replaceAll ? "g" : "") + (caseSensitive ? "" : "i");
      const pattern = useRegex ? new RegExp(find, flags) : new RegExp(escapeRegExp(find), flags);
      const matches = input.match(pattern);
      setMatchCount(matches ? matches.length : 0);
      setResult(input.replace(pattern, replace));
    } catch (e) {
      setError("Invalid regex pattern: " + (e as Error).message);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const inputClass =
    "w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const btnClass =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const labelClass = "text-sm font-medium mb-1 block";

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Find & Replace</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Search and replace text in your browser.</p>

      <div className="space-y-4 mb-4">
        <div>
          <label className={labelClass}>Input Text</label>
          <textarea
            className={inputClass}
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here..."
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", resize: "vertical" }}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Find</label>
            <input
              className={inputClass}
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder="Text or regex pattern..."
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            />
          </div>
          <div>
            <label className={labelClass}>Replace With</label>
            <input
              className={inputClass}
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Replacement text..."
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={replaceAll} onChange={(e) => setReplaceAll(e.target.checked)} className="rounded" />
            Replace all
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="rounded" />
            Case sensitive
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className="rounded" />
            Regex
          </label>
          <button onClick={handleReplace} className={`${btnClass}`} style={{ backgroundColor: "var(--accent)", color: "#fff", marginLeft: "auto" }}>
            Replace
          </button>
        </div>

        {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
        {matchCount > 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>{matchCount} match{matchCount !== 1 ? "es" : ""} replaced</p>}
      </div>

      <div className="mb-4">
        <label className={labelClass}>Result</label>
        <div
          className="p-4 rounded-lg border whitespace-pre-wrap font-mono text-sm break-words"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", minHeight: "6rem", color: "var(--fg)" }}
        >
          {result || "Click \"Replace\" to see the result."}
        </div>
      </div>

      <button onClick={handleCopy} disabled={!result} className={`${btnClass} disabled:opacity-40`} style={{ backgroundColor: copied ? "var(--success)" : "var(--accent)", color: "#fff" }}>
        {copied ? "Copied!" : "Copy Result"}
      </button>
    </div>
  );
}

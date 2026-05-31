"use client";

import { useState } from "react";
import Link from "next/link";

const AI_CHARS: { name: string; pattern: RegExp }[] = [
  { name: "LRM (Left-to-Right Mark)", pattern: /\u200E/g },
  { name: "RLM (Right-to-Left Mark)", pattern: /\u200F/g },
  { name: "ZWJ (Zero Width Joiner)", pattern: /\u200D/g },
  { name: "ZWNJ (Zero Width Non-Joiner)", pattern: /\u200C/g },
  { name: "Zero Width Space", pattern: /\u200B/g },
  { name: "LRE (Left-to-Right Embedding)", pattern: /\u202A/g },
  { name: "RLE (Right-to-Left Embedding)", pattern: /\u202B/g },
  { name: "PDF (Pop Directional Formatting)", pattern: /\u202C/g },
  { name: "LRO (Left-to-Right Override)", pattern: /\u202D/g },
  { name: "RLO (Right-to-Left Override)", pattern: /\u202E/g },
  { name: "Zero Width No-Break Space (BOM)", pattern: /\uFEFF/g },
  { name: "Hair Space", pattern: /\u200A/g },
  { name: "Soft Hyphen", pattern: /\u00AD/g },
  { name: "Thin Space", pattern: /\u2009/g },
  { name: "Medium Mathematical Space", pattern: /\u205F/g },
];

function cleanText(text: string) {
  let cleaned = text;
  const stats: { name: string; count: number }[] = [];
  for (const { name, pattern } of AI_CHARS) {
    const matches = cleaned.match(pattern);
    if (matches && matches.length > 0) {
      stats.push({ name, count: matches.length });
    }
    cleaned = cleaned.replace(pattern, "");
  }
  return { cleaned, stats };
}

export default function RemoveAiCharsPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [stats, setStats] = useState<{ name: string; count: number }[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleClean = () => {
    if (!input) return setError("Please paste some text first.");
    setError("");
    const { cleaned, stats } = cleanText(input);
    setResult(cleaned);
    setStats(stats);
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

  const totalRemoved = stats.reduce((sum, s) => sum + s.count, 0);

  const inputClass =
    "w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const btnClass =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const labelClass = "text-sm font-medium mb-1 block";

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Remove AI Characters</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Strip hidden Unicode characters (LRM, RLM, ZWJ, zero-width spaces, etc.) commonly found in AI-generated text.
      </p>

      <div className="space-y-4 mb-4">
        <div>
          <label className={labelClass}>Input Text</label>
          <textarea
            className={inputClass}
            rows={6}
            value={input}
            onChange={(e) => { setInput(e.target.value); setStats([]); setResult(""); setError(""); }}
            placeholder="Paste text that may contain hidden characters..."
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", resize: "vertical" }}
          />
        </div>

        <button onClick={handleClean} disabled={!input} className={`${btnClass} disabled:opacity-40`} style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
          Clean Text
        </button>

        {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
      </div>

      {stats.length > 0 && (
        <div className="p-4 rounded-lg border mb-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <p className="text-sm font-medium mb-2" style={{ color: "var(--success)" }}>
            Removed {totalRemoved} hidden character{totalRemoved !== 1 ? "s" : ""}
          </p>
          <ul className="text-xs space-y-1" style={{ color: "var(--muted)" }}>
            {stats.map((s) => (
              <li key={s.name}>{s.name}: {s.count}</li>
            ))}
          </ul>
        </div>
      )}

      {result && (
        <div className="mb-4">
          <label className={labelClass}>Cleaned Result</label>
          <div
            className="p-4 rounded-lg border whitespace-pre-wrap font-mono text-sm break-words"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", minHeight: "6rem", color: "var(--fg)" }}
          >
            {result}
          </div>
        </div>
      )}

      {result && (
        <button onClick={handleCopy} className={btnClass} style={{ backgroundColor: copied ? "var(--success)" : "var(--accent)", color: "#fff" }}>
          {copied ? "Copied!" : "Copy Result"}
        </button>
      )}
    </div>
  );
}

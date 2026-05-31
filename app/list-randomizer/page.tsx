"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function ListRandomizerPage() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<"pick" | null>(null);

  const items = useMemo(() => input.split("\n").map((s) => s.trim()).filter(Boolean), [input]);

  const shuffle = () => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleShuffle = () => {
    setResults(shuffle());
    setLastAction(null);
  };

  const handlePick = () => {
    const n = Math.min(count, items.length);
    const shuffled = shuffle();
    setResults(shuffled.slice(0, n));
    setLastAction("pick");
  };

  const handleRemovePicked = () => {
    const remaining = items.filter((item) => !results.includes(item));
    setInput(remaining.join("\n"));
    setResults([]);
    setLastAction(null);
  };

  const handleReset = () => {
    setResults([]);
    setLastAction(null);
  };

  const inputClass = "w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">List Randomizer</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Enter a list of items (one per line), then shuffle or pick randomly.</p>

      <div className="space-y-4 max-w-lg">
        <div>
          <label className="text-sm font-medium mb-1 block">Items <span className="text-xs" style={{ color: "var(--muted)" }}>({items.length} items)</span></label>
          <textarea className={inputClass} rows={8} value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Enter one item per line..."
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", resize: "vertical" }} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleShuffle} disabled={items.length < 2}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 transition-colors"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            Shuffle All
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm">Pick</span>
            <input type="number" min={1} max={items.length || 1} value={count} onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 rounded-lg border px-2 py-1.5 text-sm text-center outline-none"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
            <button onClick={handlePick} disabled={items.length < 1}
              className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 transition-colors"
              style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
              Pick
            </button>
          </div>

          {lastAction === "pick" && results.length > 0 && (
            <button onClick={handleRemovePicked} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "#ef4444", color: "#fff" }}>
              Remove Picked from List
            </button>
          )}
          {results.length > 0 && (
            <button onClick={handleReset} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ border: "1px solid var(--border)" }}>
              Reset
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div className="rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <div className="px-4 py-2 border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--muted)", backgroundColor: "var(--surface)" }}>
              Result ({results.length} item{results.length > 1 ? "s" : ""})
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {results.map((item, i) => (
                <div key={i} className="px-4 py-2.5 text-sm flex items-center gap-3" style={{ backgroundColor: "var(--surface)" }}>
                  <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>#{i + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

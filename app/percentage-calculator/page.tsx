"use client";

import { useState } from "react";
import Link from "next/link";

type Mode = "xy" | "xpy" | "xyp" | "change";

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState<Mode>("xy");
  const [x, setX] = useState("20");
  const [y, setY] = useState("200");
  const [oldVal, setOldVal] = useState("50");
  const [newVal, setNewVal] = useState("75");

  const num = (s: string) => parseFloat(s);
  const isNum = (s: string) => !isNaN(parseFloat(s)) && s.trim() !== "";

  const results: { label: string; value: string }[] = [];

  if (mode === "xy" && isNum(x) && isNum(y)) {
    results.push({ label: "Result", value: `${(num(x) / 100) * num(y)}` });
    results.push({ label: "Formula", value: `${x}% of ${y} = (${x} / 100) × ${y}` });
  }

  if (mode === "xpy" && isNum(x) && isNum(y)) {
    const p = (num(x) / num(y)) * 100;
    results.push({ label: "Result", value: `${p.toFixed(2)}%` });
    results.push({ label: "Formula", value: `${x} is ${p.toFixed(2)}% of ${y}` });
  }

  if (mode === "xyp" && isNum(x) && isNum(y)) {
    const v = (num(y) / num(x)) * 100;
    results.push({ label: "Result", value: `${v.toFixed(2)}` });
    results.push({ label: "Formula", value: `${v.toFixed(2)} is ${y}% of ${x}` });
  }

  if (mode === "change" && isNum(oldVal) && isNum(newVal)) {
    const diff = num(newVal) - num(oldVal);
    const p = (diff / num(oldVal)) * 100;
    const dir = diff >= 0 ? "increase" : "decrease";
    results.push({ label: "Difference", value: `${diff >= 0 ? "+" : ""}${diff.toFixed(2)}` });
    results.push({ label: "Percentage Change", value: `${p >= 0 ? "+" : ""}${p.toFixed(2)}% ${dir}` });
  }

  const inputClass = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const modeBtn = (m: Mode, label: string) => (
    <button key={m} onClick={() => setMode(m)}
      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
      style={{ backgroundColor: mode === m ? "var(--accent)" : "var(--surface)", color: mode === m ? "#fff" : "inherit", border: "1px solid var(--border)" }}>
      {label}
    </button>
  );

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Percentage Calculator</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Quick percentage calculations: find percentages, ratios, and changes.</p>

      <div className="space-y-4 max-w-lg">
        <div className="flex flex-wrap gap-2">
          {modeBtn("xy", "X% of Y")}
          {modeBtn("xpy", "X is what % of Y?")}
          {modeBtn("xyp", "X is Y% of what?")}
          {modeBtn("change", "% Change")}
        </div>

        {(mode === "xy" || mode === "xpy") && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{mode === "xy" ? "Percentage (X)" : "Number (X)"}</label>
              <input type="number" value={x} onChange={(e) => setX(e.target.value)} className={inputClass} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{mode === "xy" ? "Number (Y)" : "Total (Y)"}</label>
              <input type="number" value={y} onChange={(e) => setY(e.target.value)} className={inputClass} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
            </div>
          </div>
        )}

        {mode === "xyp" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Result (X)</label>
              <input type="number" value={x} onChange={(e) => setX(e.target.value)} className={inputClass} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Percentage (Y)</label>
              <input type="number" value={y} onChange={(e) => setY(e.target.value)} className={inputClass} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
            </div>
          </div>
        )}

        {mode === "change" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Old Value</label>
              <input type="number" value={oldVal} onChange={(e) => setOldVal(e.target.value)} className={inputClass} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">New Value</label>
              <input type="number" value={newVal} onChange={(e) => setNewVal(e.target.value)} className={inputClass} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="rounded-lg border p-4 space-y-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            {results.map((r) => (
              <div key={r.label}>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{r.label}</div>
                <div className="text-xl font-bold">{r.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

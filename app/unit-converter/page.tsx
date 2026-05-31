"use client";

import { useState } from "react";
import Link from "next/link";

type UnitCategory = "length" | "weight" | "temperature" | "volume" | "area";

interface UnitDef {
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const UNITS: Record<UnitCategory, UnitDef[]> = {
  length: [
    { label: "Meters", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilometers", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Centimeters", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: "Millimeters", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Miles", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { label: "Yards", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { label: "Feet", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: "Inches", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { label: "Nautical Miles", toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
  ],
  weight: [
    { label: "Kilograms", toBase: (v) => v, fromBase: (v) => v },
    { label: "Grams", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Milligrams", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { label: "Metric Tons", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Pounds", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { label: "Ounces", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { label: "Stones", toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
  ],
  temperature: [
    { label: "Celsius", toBase: (v) => v, fromBase: (v) => v },
    { label: "Fahrenheit", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { label: "Kelvin", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  volume: [
    { label: "Liters", toBase: (v) => v, fromBase: (v) => v },
    { label: "Milliliters", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Gallons (US)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { label: "Quarts (US)", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { label: "Cups", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { label: "Fluid Ounces (US)", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    { label: "Cubic Meters", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  ],
  area: [
    { label: "Square Meters", toBase: (v) => v, fromBase: (v) => v },
    { label: "Square Kilometers", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { label: "Hectares", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { label: "Acres", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { label: "Square Feet", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { label: "Square Miles", toBase: (v) => v * 2.59e6, fromBase: (v) => v / 2.59e6 },
  ],
};

const CATEGORIES: { key: UnitCategory; label: string }[] = [
  { key: "length", label: "Length" },
  { key: "weight", label: "Weight" },
  { key: "temperature", label: "Temperature" },
  { key: "volume", label: "Volume" },
  { key: "area", label: "Area" },
];

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState("1");

  const units = UNITS[category];
  const fromUnit = units[fromIdx];
  const toUnit = units[toIdx];
  const num = parseFloat(value);
  const result = isNaN(num) ? "" : toUnit.fromBase(fromUnit.toBase(num)).toFixed(10).replace(/\.?0+$/, "");

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Unit Converter</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Convert between units of length, weight, temperature, volume, and area.</p>

      <div className="space-y-4 max-w-lg">
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c.key} onClick={() => { setCategory(c.key); setFromIdx(0); setToIdx(1); }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: category === c.key ? "var(--accent)" : "var(--surface)", color: category === c.key ? "#fff" : "inherit", border: "1px solid var(--border)" }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">From</label>
            <select value={fromIdx} onChange={(e) => setFromIdx(Number(e.target.value))}
              className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
              {units.map((u, i) => (<option key={i} value={i}>{u.label}</option>))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">To</label>
            <select value={toIdx} onChange={(e) => setToIdx(Number(e.target.value))}
              className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
              {units.map((u, i) => (<option key={i} value={i}>{u.label}</option>))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
        </div>

        {result !== "" && (
          <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Result</div>
            <div className="text-2xl font-bold mt-1">
              {value} {fromUnit.label} = {result} {toUnit.label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

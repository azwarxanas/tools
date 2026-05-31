"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

function generatePassword(length: number, upper: boolean, lower: boolean, digits: boolean, symbols: boolean): string {
  const sets: string[] = [];
  if (upper) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (lower) sets.push("abcdefghijklmnopqrstuvwxyz");
  if (digits) sets.push("0123456789");
  if (symbols) sets.push("!@#$%^&*()_+-=[]{}|;:,.<>?");
  const all = sets.join("");
  if (!all) return "";

  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  let result = "";

  // Ensure at least one char from each selected set
  for (const set of sets) {
    result += set[arr[result.length] % set.length];
  }

  // Fill remaining
  for (let i = result.length; i < length; i++) {
    result += all[arr[i] % all.length];
  }

  // Shuffle with Fisher-Yates
  const a = result.split("");
  for (let i = a.length - 1; i > 0; i--) {
    const j = arr[i + sets.length] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join("");
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setPassword(generatePassword(length, upper, lower, digits, symbols));
  }, [length, upper, lower, digits, symbols]);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const entropy = (() => {
    let bits = 0;
    if (upper) bits += 26;
    if (lower) bits += 26;
    if (digits) bits += 10;
    if (symbols) bits += 24;
    if (bits === 0) return 0;
    return Math.round(length * Math.log2(bits));
  })();

  const strength = entropy < 40 ? "Weak" : entropy < 60 ? "Fair" : entropy < 80 ? "Good" : "Strong";
  const strengthColor = entropy < 40 ? "var(--danger)" : entropy < 60 ? "#f59e0b" : entropy < 80 ? "#22c55e" : "var(--success)";

  const btnClass = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const labelClass = "text-sm font-medium mb-1 block";

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Password Generator</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Generate strong, random passwords with custom options.</p>

      <div className="rounded-lg border p-4 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
        <div>
          <label className={labelClass}>Generated Password</label>
          <div className="flex gap-2">
            <input type="text" readOnly value={password} className="flex-1 rounded-lg border px-3 py-3 font-mono text-lg tracking-wider outline-none" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)", color: "var(--fg)" }} placeholder="Click Generate" />
            <button onClick={handleCopy} disabled={!password} className={`${btnClass} disabled:opacity-40`} style={{ backgroundColor: copied ? "var(--success)" : "var(--accent)", color: "#fff" }}>{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Strength:</span>
          <span className="text-sm font-bold" style={{ color: strengthColor }}>{password ? strength : "—"}</span>
          {password && <span className="text-xs" style={{ color: "var(--muted)" }}>({entropy} bits)</span>}
        </div>

        <div>
          <label className={labelClass}>Length: {length}</label>
          <input type="range" className="w-full" min={4} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="rounded" /> A–Z</label>
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} className="rounded" /> a–z</label>
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} className="rounded" /> 0–9</label>
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="rounded" /> !@#$%</label>
        </div>

        <button onClick={generate} className={btnClass} style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
          Generate Password
        </button>
      </div>
    </div>
  );
}

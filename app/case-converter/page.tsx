"use client";

import { useState } from "react";
import Link from "next/link";

const CASES: { key: string; label: string; convert: (s: string) => string }[] = [
  {
    key: "lower",
    label: "lowercase",
    convert: (s) => s.toLowerCase(),
  },
  {
    key: "upper",
    label: "UPPERCASE",
    convert: (s) => s.toUpperCase(),
  },
  {
    key: "title",
    label: "Title Case",
    convert: (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    key: "sentence",
    label: "Sentence case",
    convert: (s) => {
      const lower = s.toLowerCase();
      return lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    },
  },
  {
    key: "camel",
    label: "camelCase",
    convert: (s) =>
      s
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase()),
  },
  {
    key: "pascal",
    label: "PascalCase",
    convert: (s) =>
      s
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^[a-z]/, (c) => c.toUpperCase()),
  },
  {
    key: "snake",
    label: "snake_case",
    convert: (s) =>
      s
        .replace(/([A-Z])/g, "_$1")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_|_$/g, "")
        .toLowerCase(),
  },
  {
    key: "kebab",
    label: "kebab-case",
    convert: (s) =>
      s
        .replace(/([A-Z])/g, "-$1")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase(),
  },
  {
    key: "constant",
    label: "CONSTANT_CASE",
    convert: (s) =>
      s
        .replace(/([A-Z])/g, "_$1")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_|_$/g, "")
        .toUpperCase(),
  },
  {
    key: "alternating",
    label: "aLtErNaTiNg",
    convert: (s) =>
      s
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
  },
  {
    key: "inverse",
    label: "InVeRsE CaSe",
    convert: (s) =>
      s
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
  },
];

export default function CaseConverterPage() {
  const [input, setInput] = useState("");

  const inputClass =
    "w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const labelClass = "text-sm font-medium mb-1 block";

  return (
    <div>
      <Link
        href="/"
        className="text-sm inline-flex items-center gap-1 mb-6 hover:underline"
        style={{ color: "var(--muted)" }}
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-bold mb-2">Case Converter</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Convert text between different letter cases.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>Input</label>
          <textarea
            className={inputClass}
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here..."
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              resize: "vertical",
            }}
          />
          {input && (
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {input.length} character{input.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Results</label>
          <div className="space-y-2">
            {CASES.map((c) => {
              const result = input ? c.convert(input) : "";
              return (
                <div
                  key={c.key}
                  className="rounded-lg border p-2.5"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                      {c.label}
                    </span>
                    {result && (
                      <CopyButton text={result} />
                    )}
                  </div>
                  <code
                    className="font-mono text-sm break-words"
                    style={{ color: "var(--fg)" }}
                  >
                    {result || "—"}
                  </code>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button
      onClick={handle}
      className="text-xs px-2 py-0.5 rounded transition-colors"
      style={{
        backgroundColor: copied ? "var(--success)" : "var(--accent)",
        color: "#fff",
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

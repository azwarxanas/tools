"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const readTime = Math.ceil(words / 200);
    const speakTime = Math.ceil(words / 130);
    return { chars, charsNoSpace, words, sentences, paragraphs, lines, readTime, speakTime };
  }, [text]);

  const inputClass = "w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const statCard = "rounded-lg border p-4 text-center" as const;

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Word Counter</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Count words, characters, sentences, paragraphs, and more in real-time.</p>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Your Text</label>
          <textarea className={inputClass} rows={10} value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", resize: "vertical" }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={statCard} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="text-2xl font-bold">{stats.words}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Words</div>
          </div>
          <div className={statCard} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="text-2xl font-bold">{stats.chars}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Characters</div>
          </div>
          <div className={statCard} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="text-2xl font-bold">{stats.charsNoSpace}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Chars (no space)</div>
          </div>
          <div className={statCard} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="text-2xl font-bold">{stats.sentences}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Sentences</div>
          </div>
          <div className={statCard} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="text-2xl font-bold">{stats.paragraphs}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Paragraphs</div>
          </div>
          <div className={statCard} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="text-2xl font-bold">{stats.lines}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Lines</div>
          </div>
          <div className={statCard} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="text-2xl font-bold">{stats.readTime}m</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Read time</div>
          </div>
          <div className={statCard} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="text-2xl font-bold">{stats.speakTime}m</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Speak time</div>
          </div>
        </div>
      </div>
    </div>
  );
}

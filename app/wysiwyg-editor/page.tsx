"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

const FMT = [
  { cmd: "bold", icon: "B", title: "Bold" },
  { cmd: "italic", icon: "I", title: "Italic" },
  { cmd: "underline", icon: "U", title: "Underline" },
] as const;

const HEADINGS = [
  { cmd: "formatBlock", val: "h1", label: "H1" },
  { cmd: "formatBlock", val: "h2", label: "H2" },
  { cmd: "formatBlock", val: "h3", label: "H3" },
  { cmd: "formatBlock", val: "p", label: "P" },
] as const;

const LISTS = [
  { cmd: "insertUnorderedList", icon: "•", title: "Bullet List" },
  { cmd: "insertOrderedList", icon: "1.", title: "Numbered List" },
] as const;

const ALIGNS = [
  { cmd: "justifyLeft", icon: "≡", title: "Align Left" },
  { cmd: "justifyCenter", icon: "≡", title: "Center" },
  { cmd: "justifyRight", icon: "≡", title: "Align Right" },
] as const;

export default function WysiwygEditorPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) setHtml(editorRef.current.innerHTML);
  }, []);

  const updateHtml = () => {
    if (editorRef.current) setHtml(editorRef.current.innerHTML);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handlePaste = useCallback(() => {
    setTimeout(updateHtml, 0);
  }, []);

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">WYSIWYG Editor</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Rich text editor with HTML output. Format your text and copy the generated HTML.</p>

      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          {FMT.map((f) => (
            <button key={f.cmd} onClick={() => exec(f.cmd)} title={f.title}
              className="w-8 h-8 rounded text-sm font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              style={{ fontWeight: f.cmd === "bold" ? 700 : f.cmd === "italic" ? "italic" : "underline" }}>
              {f.icon}
            </button>
          ))}
          <span className="w-px h-6 mx-1" style={{ backgroundColor: "var(--border)" }} />
          {HEADINGS.map((h) => (
            <button key={h.label} onClick={() => exec(h.cmd, h.val)}
              className="px-2 h-8 rounded text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              {h.label}
            </button>
          ))}
          <span className="w-px h-6 mx-1" style={{ backgroundColor: "var(--border)" }} />
          {LISTS.map((l) => (
            <button key={l.cmd} onClick={() => exec(l.cmd)} title={l.title}
              className="px-2 h-8 rounded text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              {l.icon}
            </button>
          ))}
          <span className="w-px h-6 mx-1" style={{ backgroundColor: "var(--border)" }} />
          {ALIGNS.map((a) => (
            <button key={a.cmd} onClick={() => exec(a.cmd)} title={a.title}
              className="px-2 h-8 rounded text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              {a.icon}
            </button>
          ))}
          <span className="w-px h-6 mx-1" style={{ backgroundColor: "var(--border)" }} />
          <button onClick={() => exec("undo")} title="Undo"
            className="px-2 h-8 rounded text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">↩</button>
          <button onClick={() => exec("redo")} title="Redo"
            className="px-2 h-8 rounded text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">↪</button>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={updateHtml}
          onPaste={handlePaste}
          className="rounded-lg border p-4 min-h-[250px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] prose prose-sm max-w-none"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        />

        {/* HTML Output */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">HTML Output</label>
            <button onClick={handleCopy}
              className="text-xs px-3 py-1 rounded font-medium transition-colors"
              style={{ backgroundColor: copied ? "var(--success)" : "var(--accent)", color: "#fff" }}>
              {copied ? "Copied!" : "Copy HTML"}
            </button>
          </div>
          <textarea readOnly value={html}
            className="w-full rounded-lg border px-3 py-2 font-mono text-xs outline-none"
            rows={8}
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--fg)", resize: "vertical" }}
          />
        </div>

        {/* Clear button */}
        <button onClick={() => { if (editorRef.current) { editorRef.current.innerHTML = ""; setHtml(""); } }}
          className="text-xs px-3 py-1.5 rounded font-medium transition-colors"
          style={{ border: "1px solid var(--border)" }}>
          Clear Editor
        </button>
      </div>
    </div>
  );
}

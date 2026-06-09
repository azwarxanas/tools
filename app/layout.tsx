"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const menuGroups = [
  {
    label: "Text",
    items: [
      { href: "/find-replace", title: "Find & Replace", icon: "↔" },
      { href: "/remove-ai-chars", title: "Remove AI Characters", icon: "🧹" },
      { href: "/case-converter", title: "Case Converter", icon: "Aa" },
      { href: "/word-counter", title: "Word Counter", icon: "Σ" },
      { href: "/wysiwyg-editor", title: "WYSIWYG Editor", icon: "📝" },
    ],
  },
  {
    label: "Image",
    items: [
      { href: "/resize-image", title: "Resize Image", icon: "📐" },
      { href: "/compress-image", title: "Compress Image", icon: "🗜" },
    ],
  },
  {
    label: "Convert",
    items: [
      { href: "/unit-converter", title: "Unit Converter", icon: "⚖" },
      { href: "/percentage-calculator", title: "Percentage Calculator", icon: "%" },
    ],
  },
  {
    label: "Utility",
    items: [
      { href: "/password-generator", title: "Password Generator", icon: "🔐" },
      { href: "/qr-generator", title: "QR Generator", icon: "▦" },
      { href: "/date-calculator", title: "Date Calculator", icon: "📅" },
      { href: "/list-randomizer", title: "List Randomizer", icon: "🎲" },
      { href: "/timer-stopwatch", title: "Timer / Stopwatch", icon: "⏱" },
      { href: "/spinner", title: "Spinner", icon: "🎯" },
    ],
  },
  {
    label: "Data",
    items: [
      { href: "/json-formatter", title: "JSON Formatter", icon: "{}" },
      { href: "/hash-generator", title: "Hash Generator", icon: "#" },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setOpen(false);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col md:flex-row">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <Link href="/" className="font-semibold text-lg tracking-tight" onClick={close}>
            Daily Tools
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Overlay */}
        {open && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/30"
            onClick={close}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-0 z-50 md:z-auto
            h-full w-64
            transform transition-transform duration-200 ease-in-out
            ${open ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            border-r flex flex-col shrink-0
          `}
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="p-4 border-b hidden md:block" style={{ borderColor: "var(--border)" }}>
            <Link href="/" className="font-semibold text-lg tracking-tight block">
              Daily Tools
            </Link>
          </div>
          <div className="p-4 border-b md:hidden flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <span className="font-semibold text-lg tracking-tight">Daily Tools</span>
            <button onClick={close} className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <nav className="p-4 flex-1 overflow-y-auto space-y-3">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <div className="text-[10px] font-semibold uppercase tracking-widest mb-1 px-3" style={{ color: "var(--muted)" }}>
                  {group.label}
                </div>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors"
                        style={{
                          backgroundColor: active ? "var(--accent)" : "transparent",
                          color: active ? "#fff" : "inherit",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) e.currentTarget.style.backgroundColor = "rgba(128,128,128,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          if (!active) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <span>{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div
            className="p-4 border-t hidden md:block text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            All processing happens in your browser.
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
            {children}
          </main>
          <footer
            className="border-t px-4 py-4 text-center text-sm md:hidden"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            All processing happens in your browser.
          </footer>
        </div>
      </body>
    </html>
  );
}

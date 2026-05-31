import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Tools — Free Online Utilities",
  description:
    "Free online tools: text processing, image editing, developer utilities, and more. All processing done in your browser — no data uploaded.",
};

const menuGroups = [
  {
    label: "Text",
    items: [
      { href: "/find-replace", title: "Find & Replace", icon: "↔" },
      { href: "/remove-ai-chars", title: "Remove AI Characters", icon: "🧹" },
      { href: "/case-converter", title: "Case Converter", icon: "Aa" },
      { href: "/word-counter", title: "Word Counter", icon: "Σ" },
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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col md:flex-row">
        <aside
          className="w-full md:w-64 border-b md:border-b-0 md:border-r flex flex-col shrink-0"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
            <Link href="/" className="font-semibold text-lg tracking-tight block">
              Daily Tools
            </Link>
          </div>
          <nav className="p-4 flex-1 overflow-y-auto space-y-3">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <div className="text-[10px] font-semibold uppercase tracking-widest mb-1 px-3" style={{ color: "var(--muted)" }}>
                  {group.label}
                </div>
                <div className="flex md:flex-col gap-1 flex-wrap">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors w-auto md:w-full"
                    >
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  ))}
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

        <div className="flex-1 flex flex-col min-w-0">
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

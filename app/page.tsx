import Link from "next/link";

const toolGroups = [
  {
    label: "Text",
    items: [
      { href: "/find-replace", title: "Find & Replace", desc: "Search and replace text with regex support. Case-sensitive toggle, replace all or one-by-one.", icon: "↔" },
      { href: "/remove-ai-chars", title: "Remove AI Characters", desc: "Strip hidden Unicode characters like LRM, RLM, ZWJ, zero-width spaces from AI-generated text.", icon: "🧹" },
      { href: "/case-converter", title: "Case Converter", desc: "Convert text between lowercase, UPPERCASE, Title Case, camelCase, snake_case, and more.", icon: "Aa" },
      { href: "/word-counter", title: "Word Counter", desc: "Count words, characters, sentences, and paragraphs in real-time as you type.", icon: "Σ" },
    ],
  },
  {
    label: "Image",
    items: [
      { href: "/resize-image", title: "Resize Image", desc: "Resize images to preset or custom dimensions. Lock aspect ratio, batch resize, multiple formats.", icon: "📐" },
      { href: "/compress-image", title: "Compress Image", desc: "Reduce image file size with quality slider. Choose output format: JPEG, PNG, WebP, AVIF.", icon: "🗜" },
    ],
  },
  {
    label: "Convert",
    items: [
      { href: "/unit-converter", title: "Unit Converter", desc: "Convert between units of length, weight, temperature, volume, and area.", icon: "⚖" },
      { href: "/percentage-calculator", title: "Percentage Calculator", desc: "Calculate percentages, discounts, ratios, and percentage change easily.", icon: "%" },
    ],
  },
  {
    label: "Utility",
    items: [
      { href: "/password-generator", title: "Password Generator", desc: "Generate strong random passwords with configurable length, character sets, and strength meter.", icon: "🔐" },
      { href: "/qr-generator", title: "QR Generator", desc: "Generate custom QR codes with gradient themes, dot/line styles, rounded corners, and center logo.", icon: "▦" },
      { href: "/date-calculator", title: "Date Calculator", desc: "Calculate date differences and add or subtract days from any date.", icon: "📅" },
      { href: "/list-randomizer", title: "List Randomizer", desc: "Shuffle lists, pick random items, draw winners — your data stays private.", icon: "🎲" },
      { href: "/timer-stopwatch", title: "Timer / Stopwatch", desc: "Countdown timer and stopwatch with lap tracking for timing anything.", icon: "⏱" },
    ],
  },
  {
    label: "Data",
    items: [
      { href: "/json-formatter", title: "JSON Formatter", desc: "Format, validate, and minify JSON. Beautify messy JSON with configurable indentation.", icon: "{}" },
      { href: "/hash-generator", title: "Hash Generator", desc: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes.", icon: "#" },
    ],
  },
];

export default function Home() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Free Online Tools
        </h1>
        <p style={{ color: "var(--muted)" }}>
          Simple utilities that run entirely in your browser. No uploads, no tracking.
        </p>
      </div>

      {toolGroups.map((group) => (
        <div key={group.label} className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
            {group.label}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="block p-5 rounded-xl border transition-shadow hover:shadow-md"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="text-2xl mb-2">{t.icon}</div>
                <h2 className="font-semibold mb-1">{t.title}</h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {t.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

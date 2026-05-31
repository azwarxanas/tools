"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

const QR_STYLES = [
  { value: "squares", label: "Squares" },
  { value: "dots", label: "Dots" },
  { value: "lines", label: "Lines" },
];

const ERROR_LEVELS = [
  { value: "L", label: "L — Low (7%)" },
  { value: "M", label: "M — Medium (15%)" },
  { value: "Q", label: "Q — Quartile (25%)" },
  { value: "H", label: "H — High (30%)" },
];

const THEMES = [
  { name: "Classic Black", fg: ["#000000"], bg: "#ffffff" },
  { name: "Ocean Blue", fg: ["#0062cc", "#00a8ff"], bg: "#ffffff" },
  { name: "Sunset", fg: ["#f12711", "#f5af19"], bg: "#ffffff" },
  { name: "Midnight Purple", fg: ["#0f0c29", "#302b63", "#24243e"], bg: "#ffffff" },
  { name: "Neon Green", fg: ["#00b894", "#00cec9"], bg: "#000000" },
  { name: "Cherry Red", fg: ["#ff6b6b", "#c44b8b"], bg: "#fff5f5" },
  { name: "Cyberpunk", fg: ["#f000ff", "#00d2ff"], bg: "#0a0a0a" },
  { name: "Gold", fg: ["#f2994a", "#f2c94c"], bg: "#1a1a2e" },
  { name: "Forest", fg: ["#134e5e", "#71b280"], bg: "#f0faf0" },
  { name: "Custom", fg: ["#000000"], bg: "#ffffff" },
];

function setCanvasFont(ctx: CanvasRenderingContext2D, size: number, weight: string = "bold") {
  ctx.font = `${weight} ${size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
}

function renderQRCode(
  canvas: HTMLCanvasElement,
  modules: { size: number; get: (r: number, c: number) => boolean },
  size: number,
  style: string,
  cornerRadius: number,
  fgColors: string[],
  bgColor: string,
) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const count = modules.size;
  const moduleSize = size / count;

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Foreground gradient or solid
  let fill: string | CanvasGradient = fgColors[0];
  if (fgColors.length > 1) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    fgColors.forEach((c, i) => grad.addColorStop(i / (fgColors.length - 1), c));
    fill = grad;
  }

  ctx.fillStyle = fill;

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!modules.get(row, col)) continue;

      const x = col * moduleSize;
      const y = row * moduleSize;
      const cx = x + moduleSize / 2;
      const cy = y + moduleSize / 2;

      if (style === "dots") {
        // Dots overlap slightly to ensure readability
        const dotR = moduleSize * 0.48;
        ctx.beginPath();
        ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
        ctx.fill();
      } else if (style === "lines") {
        // Full-width horizontal lines
        ctx.fillRect(x, cy - moduleSize * 0.2, moduleSize, moduleSize * 0.4);
      } else {
        // squares — fully adjacent, zero gap
        if (cornerRadius > 0 && cornerRadius < moduleSize / 2) {
          const cr = Math.min(cornerRadius, moduleSize / 2);
          ctx.beginPath();
          ctx.roundRect(x, y, moduleSize, moduleSize, cr);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, moduleSize, moduleSize);
        }
      }
    }
  }
}

function addLogo(
  canvas: HTMLCanvasElement,
  logoUrl: string,
  logoPadding: number,
): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(); return; }

      const size = canvas.width;
      const logoMaxSize = size * 0.28;
      const padding = size * (logoPadding / 100);

      // Scale logo maintaining aspect ratio
      let logoW = img.naturalWidth;
      let logoH = img.naturalHeight;
      const scale = Math.min(logoMaxSize / logoW, logoMaxSize / logoH);
      logoW *= scale;
      logoH *= scale;

      const logoX = (size - logoW) / 2;
      const logoY = (size - logoH) / 2;

      // White padding rectangle behind logo
      const padAmount = padding;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(
        logoX - padAmount,
        logoY - padAmount,
        logoW + padAmount * 2,
        logoH + padAmount * 2,
      );

      // Draw logo
      ctx.drawImage(img, logoX, logoY, logoW, logoH);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = logoUrl;
  });
}

export default function QrGeneratorPage() {
  const [text, setText] = useState("https://example.com");
  const [qrStyle, setQrStyle] = useState("squares");
  const [cornerRadius, setCornerRadius] = useState(0);
  const [errorLevel, setErrorLevel] = useState("M");
  const [qrSize, setQrSize] = useState(300);
  const [themeIdx, setThemeIdx] = useState(0);
  const [customFg, setCustomFg] = useState("#000000");
  const [customBg, setCustomBg] = useState("#ffffff");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoPadding, setLogoPadding] = useState(8);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const theme = THEMES[themeIdx];
  const isCustom = themeIdx === THEMES.length - 1;
  const fgColors = isCustom ? [customFg] : theme.fg;
  const bgColor = isCustom ? customBg : theme.bg;

  const generate = useCallback(async (): Promise<string | null> => {
    if (!text) return "Please enter text or URL.";

    const canvas = canvasRef.current;
    if (!canvas) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let qrcodeMod: any;
    try { qrcodeMod = await import("qrcode"); }
    catch { return "QR library not loaded."; }
    const qrcode = qrcodeMod.default || qrcodeMod;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let qr: any;
    try { qr = qrcode.create(text, { errorCorrectionLevel: errorLevel }); }
    catch { return "Failed to encode. Try different text."; }

    renderQRCode(canvas, qr.modules, qrSize, qrStyle, cornerRadius, fgColors, bgColor);

    if (logoFile && logoPreview) {
      await addLogo(canvas, logoPreview, logoPadding);
    }
    return null;
  }, [text, qrStyle, cornerRadius, errorLevel, qrSize, fgColors, bgColor, logoFile, logoPreview, logoPadding]);

  useEffect(() => {
    if (text) {
      generate().then((err) => { if (err) setError(err); else setError(""); });
    }
  }, [text, generate]);

  const handleLogo = useCallback((file: File | null) => {
    setLogoFile(file);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(file ? URL.createObjectURL(file) : "");
  }, [logoPreview]);

  const download = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  }, []);

  const handleCopyImage = useCallback(async () => {
    const c = canvasRef.current; if (!c) return;
    try {
      const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/png"));
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      }
    } catch { setError("Failed to copy image."); }
  }, []);

  const inputClass = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const btnClass = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  const labelClass = "text-sm font-medium mb-1 block";

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">QR Code Generator</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Generate custom QR codes with styles, gradient themes, and center logo.</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Content</label>
            <textarea className={inputClass} rows={3} value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Text or URL..."
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", resize: "vertical" }} />
          </div>

          <div>
            <label className={labelClass}>Module Style</label>
            <select className={inputClass} value={qrStyle} onChange={(e) => setQrStyle(e.target.value)} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
              {QR_STYLES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Error Correction</label>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Use <strong>High</strong> if adding a center logo, <strong>Medium</strong> otherwise.</p>
            <select className={inputClass} value={errorLevel} onChange={(e) => setErrorLevel(e.target.value)} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
              {ERROR_LEVELS.map((l) => (<option key={l.value} value={l.value}>{l.label}</option>))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Size: {qrSize}px</label>
              <input type="range" className="w-full" min={100} max={600} step={10} value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} />
            </div>
            <div>
              <label className={labelClass}>Corner Radius: {cornerRadius}px</label>
              <input type="range" className="w-full" min={0} max={20} step={1} value={cornerRadius} onChange={(e) => setCornerRadius(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Theme</label>
            <div className="flex flex-wrap gap-1.5">
              {THEMES.map((t, i) => (
                <button key={t.name}
                  onClick={() => setThemeIdx(i)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${i === themeIdx ? 'ring-2 ring-[var(--accent)]' : ''}`}
                  style={{ borderColor: "var(--border)", backgroundColor: t.bg, color: t.fg[0] }}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {isCustom && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Foreground</label><input type="color" className="w-full h-10 rounded-lg border cursor-pointer" value={customFg} onChange={(e) => setCustomFg(e.target.value)} style={{ borderColor: "var(--border)" }} /></div>
              <div><label className={labelClass}>Background</label><input type="color" className="w-full h-10 rounded-lg border cursor-pointer" value={customBg} onChange={(e) => setCustomBg(e.target.value)} style={{ borderColor: "var(--border)" }} /></div>
            </div>
          )}

          <div>
            <label className={labelClass}>Center Logo (optional)</label>
            <input type="file" accept="image/*" className="block text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer"
              onChange={(e) => { const f = e.target.files?.[0]; handleLogo(f || null); }}
              style={{ color: "var(--fg)" }} />
            {logoPreview && (
              <div className="flex items-center gap-3 mt-1">
                <button onClick={() => handleLogo(null)} className="text-xs hover:underline" style={{ color: "var(--danger)" }}>Remove logo</button>
                <label className="text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
                  Padding: {logoPadding}px
                  <input type="range" className="w-16" min={0} max={30} step={1} value={logoPadding} onChange={(e) => setLogoPadding(Number(e.target.value))} />
                </label>
              </div>
            )}
          </div>

          {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
        </div>

        <div>
          <label className={labelClass}>Preview</label>
          <div className="rounded-lg border flex items-center justify-center overflow-hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", minHeight: "320px" }}>
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={download} disabled={!text} className={`${btnClass} disabled:opacity-40`} style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Download PNG</button>
            <button onClick={handleCopyImage} disabled={!text} className={`${btnClass} disabled:opacity-40`} style={{ backgroundColor: copied ? "var(--success)" : "var(--accent)", color: "#fff" }}>{copied ? "Copied!" : "Copy Image"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

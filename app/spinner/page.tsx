"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F0B27A", "#82E0AA", "#F1948A", "#85929E", "#73C6B6",
  "#E59866", "#7FB3D8", "#C39BD3", "#76D7C4", "#F9E79F",
];

export default function SpinnerPage() {
  const [input, setInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const animRef = useRef<number>(0);

  const items = input.split("\n").map((s) => s.trim()).filter(Boolean);

  const drawWheel = (angle: number, highlightIdx: number | null = null) => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 10;
    const slice = (2 * Math.PI) / items.length;

    ctx.clearRect(0, 0, w, h);

    // Draw segments
    for (let i = 0; i < items.length; i++) {
      const start = angle + i * slice;
      const end = start + slice;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      const mid = start + slice / 2;
      const tr = r * 0.65;
      const tx = cx + Math.cos(mid) * tr;
      const ty = cy + Math.sin(mid) * tr;

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(mid + (mid > Math.PI / 2 && mid < 3 * Math.PI / 2 ? Math.PI : 0));
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 2;

      const label = items[i].length > 12 ? items[i].slice(0, 11) + "…" : items[i];
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center text
    ctx.fillStyle = "#333";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", cx, cy);

    // Pointer (top triangle, outside the wheel)
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - r - 6);
    ctx.lineTo(cx + 12, cy - r - 6);
    ctx.lineTo(cx, cy - r + 14);
    ctx.closePath();
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const spin = () => {
    if (items.length < 2 || spinning) return;
    setWinner(null);
    setSpinning(true);

    const totalSpin = 5 + Math.random() * 3; // 5-8 full rotations
    const targetAngle = Math.random() * 2 * Math.PI;
    const finalAngle = angleRef.current + totalSpin * 2 * Math.PI + targetAngle;
    const duration = 3000 + Math.random() * 1000; // 3-4 seconds
    const startAngle = angleRef.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + (finalAngle - startAngle) * eased;
      angleRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        // Determine winner
        const slice = (2 * Math.PI) / items.length;
        const normalized = ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        // Pointer is at top = -PI/2
        const pointerAngle = (3 * Math.PI / 2 - normalized + 2 * Math.PI) % (2 * Math.PI);
        const idx = Math.floor(pointerAngle / slice);
        const winIdx = idx % items.length;
        setWinner(items[winIdx]);
        drawWheel(currentAngle, winIdx);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(400, window.innerWidth - 32);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    drawWheel(angleRef.current);

    return () => cancelAnimationFrame(animRef.current);
  }, [input]);

  const inputClass = "w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Spinner</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Enter names (one per line) and spin the wheel to pick a random winner.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Names <span className="text-xs" style={{ color: "var(--muted)" }}>({items.length} items)</span></label>
            <textarea className={inputClass} rows={8} value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Enter one name per line..."
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", resize: "vertical" }} />
          </div>
          <button onClick={spin} disabled={items.length < 2 || spinning}
            className="w-full py-3 rounded-lg text-sm font-bold tracking-wider uppercase disabled:opacity-40 transition-colors"
            style={{ backgroundColor: spinning ? "#94a3b8" : "var(--accent)", color: "#fff" }}>
            {spinning ? "Spinning..." : "Spin!"}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <canvas ref={canvasRef} className="rounded-lg" />
          {winner && (
            <div className="text-center">
              <div className="text-xs" style={{ color: "var(--muted)" }}>Winner!</div>
              <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{winner}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

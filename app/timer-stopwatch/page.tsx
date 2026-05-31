"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type Tab = "stopwatch" | "timer";

export default function TimerStopwatchPage() {
  const [tab, setTab] = useState<Tab>("stopwatch");

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Timer / Stopwatch</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>A simple stopwatch with lap times and a countdown timer.</p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("stopwatch")}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: tab === "stopwatch" ? "var(--accent)" : "var(--surface)", color: tab === "stopwatch" ? "#fff" : "inherit", border: "1px solid var(--border)" }}>
          Stopwatch
        </button>
        <button onClick={() => setTab("timer")}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: tab === "timer" ? "var(--accent)" : "var(--surface)", color: tab === "timer" ? "#fff" : "inherit", border: "1px solid var(--border)" }}>
          Timer
        </button>
      </div>

      {tab === "stopwatch" ? <Stopwatch /> : <Timer />}
    </div>
  );
}

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);
  const elapsedRef = useRef(0);

  const start = useCallback(() => {
    if (running) return;
    startRef.current = Date.now();
    setRunning(true);
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = elapsedRef.current + (now - startRef.current);
      setTime(elapsed);
    }, 50);
  }, [running]);

  const pause = useCallback(() => {
    if (!running) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    elapsedRef.current += Date.now() - startRef.current;
    setRunning(false);
  }, [running]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setTime(0);
    setLaps([]);
    elapsedRef.current = 0;
  }, []);

  const lap = useCallback(() => {
    if (!running) return;
    setLaps((prev) => [time, ...prev]);
  }, [running, time]);

  const format = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-md space-y-4">
      <div className="text-5xl font-mono font-bold text-center py-8 tracking-wider" style={{ color: "var(--fg)" }}>
        {format(time)}
      </div>

      <div className="flex justify-center gap-3">
        {!running ? (
          <button onClick={start} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Start</button>
        ) : (
          <button onClick={pause} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "#eab308", color: "#000" }}>Pause</button>
        )}
        <button onClick={reset} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ border: "1px solid var(--border)" }}>Reset</button>
        <button onClick={lap} disabled={!running} className="px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-40" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Lap</button>
      </div>

      {laps.length > 0 && (
        <div className="rounded-lg border" style={{ borderColor: "var(--border)" }}>
          <div className="px-4 py-2 border-b text-xs font-semibold uppercase" style={{ borderColor: "var(--border)", color: "var(--muted)", backgroundColor: "var(--surface)" }}>
            Laps
          </div>
          <div className="divide-y max-h-48 overflow-y-auto" style={{ borderColor: "var(--border)" }}>
            {laps.map((lapTime, i) => (
              <div key={i} className="px-4 py-2 text-sm flex justify-between font-mono" style={{ backgroundColor: "var(--surface)" }}>
                <span style={{ color: "var(--muted)" }}>Lap {laps.length - i}</span>
                <span>{format(lapTime)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Timer() {
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endRef = useRef(0);

  const format = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const start = () => {
    const totalSec = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
    if (totalSec <= 0) return;
    setDone(false);
    setRunning(true);
    endRef.current = Date.now() + totalSec * 1000;
    intervalRef.current = setInterval(() => {
      const rem = endRef.current - Date.now();
      if (rem <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        setRemaining(0);
        setDone(true);
      } else {
        setRemaining(rem);
      }
    }, 100);
  };

  const pause = () => {
    if (!running) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    const rem = endRef.current - Date.now();
    setRemaining(rem > 0 ? rem : 0);
    setRunning(false);
  };

  const resume = () => {
    if (remaining <= 0) return;
    setRunning(true);
    endRef.current = Date.now() + remaining;
    intervalRef.current = setInterval(() => {
      const rem = endRef.current - Date.now();
      if (rem <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        setRemaining(0);
        setDone(true);
      } else {
        setRemaining(rem);
      }
    }, 100);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(0);
    setDone(false);
  };

  const hasStarted = remaining > 0 || done;

  return (
    <div className="max-w-md space-y-4">
      {!hasStarted ? (
        <div className="flex items-center justify-center gap-2 py-8">
          <input type="number" min={0} value={minutes} onChange={(e) => setMinutes(e.target.value)}
            className="w-20 rounded-lg border px-3 py-2 text-2xl font-mono text-center outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
          <span className="text-xl font-mono">:</span>
          <input type="number" min={0} max={59} value={seconds} onChange={(e) => setSeconds(e.target.value)}
            className="w-20 rounded-lg border px-3 py-2 text-2xl font-mono text-center outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
        </div>
      ) : (
        <div className="text-5xl font-mono font-bold text-center py-8 tracking-wider" style={{ color: done ? "#ef4444" : "var(--fg)" }}>
          {done ? "00:00" : format(remaining)}
        </div>
      )}

      {done && (
        <div className="text-center text-lg font-semibold" style={{ color: "#ef4444" }}>
          Time&apos;s Up!
        </div>
      )}

      <div className="flex justify-center gap-3">
        {!hasStarted && !running && (
          <button onClick={start} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Start</button>
        )}
        {running && (
          <button onClick={pause} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "#eab308", color: "#000" }}>Pause</button>
        )}
        {hasStarted && !running && !done && (
          <button onClick={resume} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Resume</button>
        )}
        {hasStarted && (
          <button onClick={reset} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ border: "1px solid var(--border)" }}>Reset</button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

type Mode = "diff" | "add";

export default function DateCalculatorPage() {
  const [mode, setMode] = useState<Mode>("diff");
  const [date1, setDate1] = useState("2026-01-01");
  const [date2, setDate2] = useState("2026-05-30");
  const [startDate, setStartDate] = useState("2026-05-30");
  const [addDays, setAddDays] = useState("7");

  const calcDiff = () => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const remDays = totalDays % 365;
    const months = Math.floor(remDays / 30);
    const days = remDays % 30;
    const weeks = Math.floor(totalDays / 7);
    const hours = totalDays * 24;
    const minutes = hours * 60;
    return { totalDays, years, months, days, weeks, hours, minutes };
  };

  const calcAdd = () => {
    const d = new Date(startDate);
    if (isNaN(d.getTime())) return null;
    const n = parseInt(addDays);
    if (isNaN(n)) return null;
    const result = new Date(d);
    result.setDate(result.getDate() + n);
    return result.toDateString();
  };

  const diff = mode === "diff" ? calcDiff() : null;
  const added = mode === "add" ? calcAdd() : null;

  const inputClass = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]";

  return (
    <div>
      <Link href="/" className="text-sm inline-flex items-center gap-1 mb-6 hover:underline" style={{ color: "var(--muted)" }}>← Back</Link>
      <h1 className="text-2xl font-bold mb-2">Date Calculator</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Calculate the difference between two dates, or add/subtract days from a date.</p>

      <div className="space-y-4 max-w-lg">
        <div className="flex gap-2">
          <button onClick={() => setMode("diff")}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: mode === "diff" ? "var(--accent)" : "var(--surface)", color: mode === "diff" ? "#fff" : "inherit", border: "1px solid var(--border)" }}>
            Date Difference
          </button>
          <button onClick={() => setMode("add")}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: mode === "add" ? "var(--accent)" : "var(--surface)", color: mode === "add" ? "#fff" : "inherit", border: "1px solid var(--border)" }}>
            Add / Subtract Days
          </button>
        </div>

        {mode === "diff" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Start Date</label>
                <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className={inputClass} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">End Date</label>
                <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className={inputClass} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
              </div>
            </div>
            {diff && (
              <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Total Days", value: diff.totalDays },
                    { label: "Weeks", value: diff.weeks },
                    { label: "Months (~30d)", value: diff.months },
                    { label: "Years (~365d)", value: diff.years },
                    { label: "Hours", value: diff.hours },
                    { label: "Minutes", value: diff.minutes },
                  ].map((s) => (
                    <div key={s.label} className="p-2 rounded-lg" style={{ backgroundColor: "var(--bg)" }}>
                      <div className="text-xl font-bold">{s.value.toLocaleString()}</div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {diff.years > 0 && (
                  <p className="text-sm mt-3 text-center" style={{ color: "var(--muted)" }}>
                    {diff.years} year{diff.years > 1 ? "s" : ""}, {diff.months} month{diff.months > 1 ? "s" : ""}, {diff.days} day{diff.days > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {mode === "add" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Days to Add</label>
                <input type="number" value={addDays} onChange={(e) => setAddDays(e.target.value)} className={inputClass} style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }} />
              </div>
            </div>
            {added && (
              <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
                <div className="text-xs" style={{ color: "var(--muted)" }}>Result Date</div>
                <div className="text-2xl font-bold mt-1">{added}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
